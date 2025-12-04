import React, { useState } from "react";
import OpenAI from "openai";
import { useNavigate, Link } from "react-router-dom";

interface INIT {
    method: string;
    headers: Headers;
    body: string;
}

interface QUIZ_FORM_OPTIONS {
    [key: string]: number | string;
    title: string;
    description: string;
    topic: string;
    numberOfQuestions: number;
    numberOfOptions: number;
    prompt: string;
    quizJSON: string;
}

const defaultQuizOptions: QUIZ_FORM_OPTIONS = {
    title: "",
    description: "",
    topic: "",
    numberOfQuestions: 2,
    numberOfOptions: 2,
    prompt: "",
    quizJSON: ""
};

interface QUESTION_OPTIONS {
    [key: string]: number | string | string[];
    quizId: number;
    questionText: string;
}

const defaultQuestionOptions: QUESTION_OPTIONS = {
    quizId: -1,
    questionText: ""
};

interface OPTION_OPTIONS {
    [key: string]: number | string | boolean;
    questionId: number;
    optionText: string;
    isCorrect: boolean;
}

const defaultOptionOptions: OPTION_OPTIONS = {
    questionId: -1,
    optionText: "",
    isCorrect: false
};

function normalizeQuizJson(rawJson: string, numberOfOptions: number): string {
    type Question = {
        question: string;
        options?: any;
        correct_answer: any;
        [key: string]: any;
    };

    type QuizShape = {
        questions: Question[];
        [key: string]: any;
    };

    // Clean the raw JSON text a bit
    let cleaned = rawJson.trim();
    cleaned = cleaned.replace(/^```json/i, "").replace(/```$/i, "").trim();

    let parsed: QuizShape;

    try {
        parsed = JSON.parse(cleaned);
    } catch (e) {
        console.error("Failed to parse OpenAI JSON in normalizeQuizJson:", e);
        console.error("Cleaned content that failed to parse:", cleaned);
        throw e; // Let caller decide what to do
    }

    if (!Array.isArray(parsed.questions)) {
        console.error("Parsed JSON has no 'questions' array.");
        throw new Error("Quiz JSON missing 'questions' array.");
    }

    parsed.questions = parsed.questions.map((q, index) => {
        if (!Array.isArray(q.options)) {
            q.options = [];
        }

        // Ensure options are clean strings
        q.options = q.options
            .filter((o: any) => typeof o === "string")
            .map((o: string) => o.trim())
            .filter((o: string) => o.length > 0);

        // Ensure correct_answer exists and is a string
        if (typeof q.correct_answer !== "string") {
            q.correct_answer = "Correct answer not specified";
        }
        q.correct_answer = q.correct_answer.trim();

        // If correct_answer isn't in options, inject it at front
        if (!q.options.includes(q.correct_answer)) {
            q.options.unshift(q.correct_answer);
        }

        // Remove duplicate options while preserving order
        const seen = new Set<string>();
        q.options = q.options.filter((o: string) => {
            if (seen.has(o)) return false;
            seen.add(o);
            return true;
        });

        // Truncate if too many
        if (q.options.length > numberOfOptions) {
            q.options = q.options.slice(0, numberOfOptions);
        }

        // Pad with placeholder distractors if too few
        while (q.options.length < numberOfOptions) {
            const label = String.fromCharCode(65 + q.options.length); // A, B, C...
            q.options.push(`Placeholder option ${label} for question ${index + 1}`);
        }

        // Make sure correct_answer is still included
        if (!q.options.includes(q.correct_answer)) {
            q.options[0] = q.correct_answer;
        }

        return q;
    });

    return JSON.stringify(parsed);
}

async function getOpenAiJSONResponse(
    input: string,
    numberOfOptions: number
): Promise<string> {
    const secretKey = localStorage.getItem("secretKey") || "NONE";

    const openai: OpenAI = new OpenAI({
        apiKey: secretKey,
        dangerouslyAllowBrowser: true
    });

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: input }
        ]
    });

    const content = completion.choices[0].message.content;

    if (content !== null) {
        let cleaned = content.replace("```json", "").replace("```", "");

        try {
            const normalized = normalizeQuizJson(cleaned, numberOfOptions);
            console.log("Normalized quiz JSON:", JSON.parse(normalized));
            return normalized;
        } catch (e) {
            console.error("Error during JSON normalization:", e);
            console.error("Original content from OpenAI:", cleaned);
            return "CRITICAL_ERROR";
        }
    }

    return "CRITICAL_ERROR";
}

function createJSONPrompt(input: QUIZ_FORM_OPTIONS): string {
    return `
You are generating a multiple-choice quiz in STRICT JSON ONLY (no markdown, no backticks).

Requirements:
- The quiz must have EXACTLY ${input.numberOfQuestions} questions.
- Each question must have:
  - "question": string
  - "options": an array of EXACTLY ${input.numberOfOptions} answer choices (no more, no fewer).
  - "correct_answer": a string that MUST be one of the elements in "options".

Rules:
- If you are unsure about distractor answers, invent plausible incorrect options, but always return exactly ${input.numberOfOptions} options.
- Do NOT include explanations.
- The top-level JSON must be:
  {
    "questions": [
      {
        "question": "...",
        "options": ["...", "...", "...", "..."],
        "correct_answer": "..."
      },
      ...
    ]
  }

The quiz topic is: ${input.topic}.
`.trim();
}

function AddQuiz() {
    const [quizForm, setQuizForm] = useState<QUIZ_FORM_OPTIONS>(defaultQuizOptions);
    const [quizId, setQuizId] = useState<number>(-1);
    const [errors, setErrors] = useState<string[]>([]);

    const url: string = "https://quick-quiz-257248753584.us-central1.run.app/api/quizzes";
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors([]);
        addQuiz();
    }

    async function addQuiz() {
        const token = localStorage.getItem("token");
        if (!token) {
            setErrors(["You must be logged in as a teacher to create a quiz."]);
            return;
        }

        quizForm.prompt = `This is a quiz about ${quizForm.topic}.`;

        const numberOfOptions = Number(quizForm.numberOfOptions);

        const aiResponse = await getOpenAiJSONResponse(
            createJSONPrompt(quizForm),
            numberOfOptions
        );

        if (aiResponse === "CRITICAL_ERROR") {
            setErrors([
                "There was a problem generating quiz questions. Please try again or reduce the number of questions."
            ]);
            return;
        }

        // Double-check that the AI JSON is parseable before sending to backend
        try {
            JSON.parse(aiResponse);
        } catch (e) {
            console.error("Final quiz JSON failed to parse, aborting:", e);
            setErrors([
                "Generated quiz data was invalid. Please try again."
            ]);
            return;
        }

        quizForm.quizJSON = aiResponse;

        const payload = {
            title: quizForm.title,
            description: quizForm.description,
            topic: quizForm.topic,
            numberOfQuestions: Number(quizForm.numberOfQuestions),
            numberOfOptions: numberOfOptions,
            prompt: quizForm.prompt,
            quizJSON: quizForm.quizJSON
        };

        const initHeaders: Headers = new Headers();
        initHeaders.append("Content-Type", "application/json");
        initHeaders.append("Authorization", "Bearer " + token);

        const init: INIT = {
            method: "POST",
            headers: initHeaders,
            body: JSON.stringify(payload)
        };

        fetch(url, init)
            .then((response) => {
                if (response.status === 201 || response.status === 400) {
                    return response.json();
                } else {
                    return Promise.reject(`Unexpected Status Code: ${response.status}`);
                }
            })
            .then((data) => {
                if (data.quizId) {
                    setQuizId(data.quizId);
                    addQuestionsAndOptions(data.quizJSON, data.quizId);
                    window.alert("Quiz created! Thank you for your patience.");
                    navigate("/quizzes");
                } else {
                    setErrors(data);
                }
            })
            .catch((err) => {
                console.error("Error creating quiz:", err);
                setErrors(["An unexpected error occurred while creating the quiz."]);
            });
    }

    function addQuestionsAndOptions(inJSON: string, quizId: number) {
        let jsonData: any;
        try {
            jsonData = JSON.parse(inJSON);
        } catch (e) {
            console.error("Failed to parse quizJSON in addQuestionsAndOptions:", e);
            setErrors(["Failed to process quiz questions."]);
            return;
        }

        if (!Array.isArray(jsonData.questions)) {
            console.error("No 'questions' array in quiz JSON.");
            setErrors(["Quiz data is missing questions."]);
            return;
        }

        const token: string = localStorage.getItem("token") || "DEFAULT";
        const initHeaders: Headers = new Headers();
        initHeaders.append("Content-Type", "application/json");
        initHeaders.append("Authorization", "Bearer " + token);

        jsonData.questions.forEach((q: any, index: number) => {
            const newQuestionForm: QUESTION_OPTIONS = {
                ...defaultQuestionOptions,
                quizId: quizId,
                questionText: q.question
            };

            const correctAnswer: string = q.correct_answer;
            const options: string[] = Array.isArray(q.options) ? q.options : [];

            if (options.length === 0) {
                console.warn(`Question ${index + 1} has no options, skipping.`);
                return;
            }

            const questionInit: INIT = {
                method: "POST",
                headers: initHeaders,
                body: JSON.stringify(newQuestionForm)
            };

            fetch(
                "https://quick-quiz-257248753584.us-central1.run.app/api/questions",
                questionInit
            )
                .then((response) => {
                    if (response.status === 201 || response.status === 400) {
                        return response.json();
                    } else {
                        return Promise.reject(`Unexpected Status Code: ${response.status}`);
                    }
                })
                .then((data) => {
                    console.log(
                        "Added question w/ quiz ID " +
                            newQuestionForm.quizId +
                            " with text " +
                            newQuestionForm.questionText
                    );
                    if (data.questionId) {
                        options.forEach((optText: string) => {
                            const newOptionForm: OPTION_OPTIONS = {
                                ...defaultOptionOptions,
                                questionId: data.questionId,
                                optionText: optText,
                                isCorrect: optText === correctAnswer
                            };

                            const optionInit: INIT = {
                                method: "POST",
                                headers: initHeaders,
                                body: JSON.stringify(newOptionForm)
                            };

                            fetch(
                                "https://quick-quiz-257248753584.us-central1.run.app/api/options",
                                optionInit
                            )
                                .then((response) => {
                                    if (response.status === 201 || response.status === 400) {
                                        return response.json();
                                    } else {
                                        return Promise.reject(
                                            `Unexpected Status Code: ${response.status}`
                                        );
                                    }
                                })
                                .then((data) => {
                                    if (!data.optionId) {
                                        setErrors(data);
                                    }
                                })
                                .catch(console.log);
                        });
                    } else {
                        setErrors(data);
                    }
                })
                .catch(console.log);
        });
    }

    function handleChange(input: React.FormEvent<HTMLInputElement>) {
        const { name, value } = input.currentTarget;
        const newQuizForm: QUIZ_FORM_OPTIONS = { ...quizForm };

        if (name === "numberOfQuestions" || name === "numberOfOptions") {
            newQuizForm[name] = value === "" ? 0 : parseInt(value, 10);
        } else {
            newQuizForm[name] = value;
        }

        setQuizForm(newQuizForm);
    }

    // Authorization checks use localStorage now
    if (localStorage.getItem("ROLE_Teacher") === null) {
        return (
            <div className="notfound-container">
                <h1 className="notfound-heading">403</h1>
                <p className="notfound-text">You shouldn't be here!</p>
                <a href="/" className="notfound-link">
                    Go back to Home
                </a>
            </div>
        );
    } else if (localStorage.getItem("secretKey") === null) {
        return (
            <>
                <div className="container">
                    <p>Before creating a quiz, you need to insert your OpenAI Secret Key.</p>
                    <p>Please go to &quot;Insert Your Secret Key&quot; above to do so.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <section className="container">
                <h2 className="mb-4">Create Quiz</h2>

                {errors.length > 0 && (
                    <div className="alert alert-danger">
                        <p>The Following Errors Were Found:</p>
                        <ul>
                            {errors.map((error) => (
                                <li key={error}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <fieldset className="form-group">
                        <label htmlFor="title">Quiz Title:</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className="form-control"
                            value={quizForm.title}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input
                            id="description"
                            name="description"
                            type="text"
                            className="form-control"
                            value={quizForm.description}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="topic">Quiz Topic/Subject:</label>
                        <input
                            id="topic"
                            name="topic"
                            type="text"
                            className="form-control"
                            value={quizForm.topic}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="numberOfQuestions">Number of Questions:</label>
                        <input
                            id="numberOfQuestions"
                            name="numberOfQuestions"
                            type="number"
                            className="form-control"
                            value={quizForm.numberOfQuestions}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="numberOfOptions">Number of Options to Choose From:</label>
                        <input
                            id="numberOfOptions"
                            name="numberOfOptions"
                            type="number"
                            className="form-control"
                            value={quizForm.numberOfOptions}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>

                    <div className="mt-4">
                        <button
                            className="btn btn-outline-success mr-4"
                            type="submit"
                        >
                            Create Quiz
                        </button>
                        <Link className="link btn btn-outline-danger" to={"/"} type="button">
                            Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </>
    );
}

export default AddQuiz;
