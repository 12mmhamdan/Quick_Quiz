import React from "react";
import OpenAI from "openai";
import { useState } from "react";
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
    quizJSON: "",
};

interface QUESTION_OPTIONS {
    [key: string]: number | string | string[];
    quizId: number;
    questionText: string;
}

const defaultQuestionOptions: QUESTION_OPTIONS = {
    quizId: -1,
    questionText: "",
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
    isCorrect: false,
};

function AddQuiz() {
    const [quizForm, setQuizForm] = useState<QUIZ_FORM_OPTIONS>(defaultQuizOptions);

    const [quizId, setQuizId] = useState<number>(-1);
    const [questionId, setQuestionId] = useState<number>(9999); // not really used, but leaving as-is
    const [errors, setErrors] = useState<Array<string>>([]);

    const url = "https://quick-quiz-257248753584.us-central1.run.app/api/quizzes";
    const navigate = useNavigate();

    function handleSubmit(input: React.FormEvent<HTMLFormElement>) {
        input.preventDefault();
        addQuiz();
    }

    function addQuiz() {
        // Simple prompt for metadata
        quizForm.prompt = `This is a quiz about ${quizForm.topic}.`;

        const numOptions = Number(quizForm.numberOfOptions);
        const numQuestions = Number(quizForm.numberOfQuestions);

        getOpenAiJSONResponse(
            createJSONPrompt(quizForm),
            numOptions,
            numQuestions,
            quizForm.topic
        ).then((response) => {
            if (response === "CRITICAL_ERROR") {
                window.alert("Something has gone wrong with response generation. Please try again.");
                return;
            } else {
                quizForm.quizJSON = response;

                const payload = {
                    title: quizForm.title,
                    description: quizForm.description,
                    topic: quizForm.topic,
                    numberOfQuestions: numQuestions,
                    numberOfOptions: numOptions,
                    prompt: quizForm.prompt,
                    quizJSON: quizForm.quizJSON,
                };

                const token: string = localStorage.getItem("token") || "DEFAULT";
                const initHeaders = new Headers();

                initHeaders.append("Content-Type", "application/json");
                initHeaders.append("Authorization", "Bearer " + token);

                console.log("Quiz payload being POSTed:", JSON.stringify(payload));

                const init: INIT = {
                    method: "POST",
                    headers: initHeaders,
                    body: JSON.stringify(payload),
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
                    });
            }
        });
    }

    function addQuestionsAndOptions(inJSON: string, quizId: number) {
        let jsonData: any;
        try {
            jsonData = JSON.parse(inJSON);
        } catch (e) {
            console.error("Failed to parse quizJSON in addQuestionsAndOptions:", e);
            console.error("Offending JSON:", inJSON);
            return;
        }

        if (!Array.isArray(jsonData.questions)) {
            console.error("No 'questions' array in quiz JSON.");
            return;
        }

        for (let i = 0; i < jsonData.questions.length; i++) {
            const newQuestionForm: QUESTION_OPTIONS = { ...defaultQuestionOptions };
            newQuestionForm.quizId = quizId;
            newQuestionForm.questionText = jsonData.questions[i].question;

            const options = jsonData.questions[i].options;
            if (!Array.isArray(options) || options.length === 0) {
                console.warn(`Question ${i + 1} has no options after normalization.`);
                continue;
            }

            const correctAnswer: string = jsonData.questions[i].correct_answer;

            const token: string = localStorage.getItem("token") || "DEFAULT";
            const initHeaders = new Headers();

            initHeaders.append("Content-Type", "application/json");
            initHeaders.append("Authorization", "Bearer " + token);

            const initQuestion: INIT = {
                method: "POST",
                headers: initHeaders,
                body: JSON.stringify(newQuestionForm),
            };

            fetch(
                "https://quick-quiz-257248753584.us-central1.run.app/api/questions",
                initQuestion
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
                        "Added question with quiz ID " +
                            newQuestionForm.quizId +
                            " and text " +
                            newQuestionForm.questionText
                    );
                    if (data.questionId) {
                        for (let j = 0; j < options.length; j++) {
                            const newOptionForm: OPTION_OPTIONS = { ...defaultOptionOptions };

                            newOptionForm.questionId = data.questionId;
                            newOptionForm.optionText = options[j];
                            newOptionForm.isCorrect = options[j] === correctAnswer;

                            const initOp: INIT = {
                                method: "POST",
                                headers: initHeaders,
                                body: JSON.stringify(newOptionForm),
                            };

                            fetch(
                                "https://quick-quiz-257248753584.us-central1.run.app/api/options",
                                initOp
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
                                .catch((err) => console.error("Error adding option:", err));
                        }
                    } else {
                        setErrors(data);
                    }
                })
                .catch((err) => console.error("Error adding question:", err));
        }
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

    function buildFallbackQuiz(
        topic: string,
        numberOfQuestions: number,
        numberOfOptions: number
    ): string {
        const questions = [];
        for (let i = 0; i < numberOfQuestions; i++) {
            const options: string[] = [];
            for (let j = 0; j < numberOfOptions; j++) {
                const label = String.fromCharCode(65 + j); // A, B, C, ...
                options.push(`Placeholder option ${label} for question ${i + 1}`);
            }
            questions.push({
                question: `Placeholder question ${i + 1} about ${topic}`,
                options,
                correct_answer: options[0],
            });
        }
        return JSON.stringify({ questions });
    }

    function normalizeQuizJson(
        rawJson: string,
        numberOfOptions: number,
        numberOfQuestions: number,
        topic: string
    ): string {
        type Question = {
            question: string;
            options?: string[];
            correct_answer: string;
            [key: string]: any;
        };

        type QuizShape = {
            questions: Question[];
            [key: string]: any;
        };

        // Strip out literal control characters which can show up in broken generations
        let cleaned = rawJson.replace(/[\u0000-\u0019]+/g, " ");

        let parsed: QuizShape;
        try {
            parsed = JSON.parse(cleaned);
        } catch (e) {
            console.error("Failed to parse OpenAI JSON in normalizeQuizJson:", e);
            console.error("Cleaned content that failed to parse:", cleaned);
            // Fallback: generate a safe quiz with the right shape
            return buildFallbackQuiz(topic, numberOfQuestions, numberOfOptions);
        }

        if (!Array.isArray(parsed.questions)) {
            console.error("Parsed JSON has no 'questions' array.");
            return buildFallbackQuiz(topic, numberOfQuestions, numberOfOptions);
        }

        parsed.questions = parsed.questions.map((q, index) => {
            if (!Array.isArray(q.options)) {
                q.options = [];
            }

            // Clean options
            q.options = q.options
                .filter((o) => typeof o === "string")
                .map((o) => o.trim())
                .filter((o) => o.length > 0);

            // Ensure correct_answer is present
            if (typeof q.correct_answer === "string") {
                if (!q.options.includes(q.correct_answer)) {
                    q.options.unshift(q.correct_answer);
                }
            }

            // Remove duplicates
            const seen = new Set<string>();
            q.options = q.options.filter((o) => {
                if (seen.has(o)) return false;
                seen.add(o);
                return true;
            });

            // Truncate if too many
            if (q.options.length > numberOfOptions) {
                q.options = q.options.slice(0, numberOfOptions);
            }

            // Pad if too few
            while (q.options.length < numberOfOptions) {
                const label = String.fromCharCode(65 + q.options.length); // A, B, C...
                q.options.push(
                    `Placeholder option ${label} for question ${index + 1}`
                );
            }

            // Guarantee correct_answer is in options
            if (
                typeof q.correct_answer === "string" &&
                !q.options.includes(q.correct_answer)
            ) {
                q.options[0] = q.correct_answer;
            }

            return q;
        });

        const normalized = JSON.stringify(parsed);
        try {
            console.log("Normalized quiz JSON:", JSON.parse(normalized));
        } catch {
            // If this blows up somehow, no need to crash the app.
        }

        return normalized;
    }

    async function getOpenAiJSONResponse(
        input: string,
        numberOfOptions: number,
        numberOfQuestions: number,
        topic: string
    ): Promise<string> {
        const openai: OpenAI = new OpenAI({
            apiKey: localStorage.getItem("secretKey") || "NONE",
            dangerouslyAllowBrowser: true,
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: input },
            ],
        });

        const content = completion.choices[0].message.content;

        if (content !== null) {
            let openAIOutput: string = content
                .replace("```json", "")
                .replace("```", "")
                .trim();

            const normalized = normalizeQuizJson(
                openAIOutput,
                numberOfOptions,
                numberOfQuestions,
                topic
            );

            return normalized;
        }

        return "CRITICAL_ERROR";
    }

    // Conditional Rendering:
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
                    <p>
                        Before creating a quiz, you need to insert your OpenAI Secret
                        Key.
                    </p>
                    <p>Please go to "Insert Your Secret Key" above to do so.</p>
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
                            type="string"
                            className="form-control"
                            value={quizForm.topic}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="numberOfQuestions">
                            Number of Questions:
                        </label>
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
                        <label htmlFor="numberOfOptions">
                            Number of Options to Choose From:
                        </label>
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
                        <Link
                            className="link btn btn-outline-danger"
                            to={"/"}
                            type="button"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </>
    );
}

export default AddQuiz;
