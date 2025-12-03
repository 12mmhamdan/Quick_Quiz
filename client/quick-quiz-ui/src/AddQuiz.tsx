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

let defaultQuizOptions: QUIZ_FORM_OPTIONS = {
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

let defaultQuestionOptions: QUESTION_OPTIONS = {
  quizId: -1,
  questionText: "",
};

interface OPTION_OPTIONS {
  [key: string]: number | string | boolean;
  questionId: number;
  optionText: string;
  isCorrect: boolean;
}

let defaultOptionOptions: OPTION_OPTIONS = {
  questionId: -1,
  optionText: "",
  isCorrect: false,
};

/**
 * Normalize and sanitize the JSON returned by OpenAI:
 * - strip markdown fences and any text outside the JSON object
 * - ensure each question has exactly `numberOfOptions` options
 * - ensure correct_answer is present in the options
 */
function normalizeQuizJson(rawJson: string, numberOfOptions: number): string {
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

  let cleaned = rawJson.trim();

  // Strip ```json fences if they sneak in
  cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "").trim();

  // Try to isolate JSON block between first '{' and last '}'
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  let parsed: QuizShape;

  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse OpenAI JSON in normalizeQuizJson:", e);
    console.error("Cleaned content that failed to parse:", cleaned);
    // Throw so caller can decide to treat this as CRITICAL_ERROR
    throw e;
  }

  if (!Array.isArray(parsed.questions)) {
    console.error("Parsed JSON has no 'questions' array.");
    return cleaned;
  }

  parsed.questions = parsed.questions.map((q, index) => {
    if (!Array.isArray(q.options)) {
      q.options = [];
    }

    // Clean out bad values
    q.options = q.options
      .filter((o) => typeof o === "string")
      .map((o) => o.trim())
      .filter((o) => o.length > 0);

    // If correct_answer isn't in the options, force it in
    if (typeof q.correct_answer === "string") {
      if (!q.options.includes(q.correct_answer)) {
        q.options.unshift(q.correct_answer);
      }
    }

    // Remove duplicates while preserving order
    const seen = new Set<string>();
    q.options = q.options.filter((o) => {
      if (seen.has(o)) return false;
      seen.add(o);
      return true;
    });

    // If more than N options, truncate
    if (q.options.length > numberOfOptions) {
      q.options = q.options.slice(0, numberOfOptions);
    }

    // If fewer than N options, pad with dummy distractors
    while (q.options.length < numberOfOptions) {
      const label = String.fromCharCode(65 + q.options.length); // A, B, C...
      q.options.push(
        `Placeholder option ${label} for question ${index + 1}`
      );
    }

    // Make sure correct_answer is still one of them
    if (
      typeof q.correct_answer === "string" &&
      !q.options.includes(q.correct_answer)
    ) {
      // Force the first option to be correct if needed
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
  const openai: OpenAI = new OpenAI({
    apiKey: localStorage.getItem("secretKey") || "NONE",
    dangerouslyAllowBrowser: true,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a strict JSON generator. You MUST respond with ONLY valid JSON, no markdown, no backticks, no explanations.",
      },
      { role: "user", content: input },
    ],
  });

  const content = completion.choices[0].message.content;

  if (content !== null) {
    // First strip simple fences if they appear
    let openAIOutput: string = content
      .replace("```json", "")
      .replace("```", "");

    try {
      const normalized = normalizeQuizJson(openAIOutput, numberOfOptions);

      // Safe logging (no unguarded JSON.parse)
      try {
        console.log("Normalized quiz JSON object:", JSON.parse(normalized));
      } catch {
        console.log("Normalized quiz JSON string:", normalized);
      }

      return normalized;
    } catch (e) {
      console.error("Error during JSON normalization:", e);
      return "CRITICAL_ERROR";
    }
  }

  return "CRITICAL_ERROR";
}

function AddQuiz() {
  // State Variables
  const [quizForm, setQuizForm] =
    useState<QUIZ_FORM_OPTIONS>(defaultQuizOptions);

  // When an object is created, pass in its ID.
  const [quizId, setQuizId] = useState<number>(-1);

  const [errors, setErrors] = useState<Array<string>>([]);

  const url: string =
    "https://quick-quiz-257248753584.us-central1.run.app/api/quizzes";
  const navigate: Function = useNavigate();

  // Methods
  function handleSubmit(input: React.FormEvent<HTMLFormElement>) {
    input.preventDefault();

    // Create and add the entire Quiz
    addQuiz();
  }

  function addQuiz() {
    // Create prompt from inputted data:
    quizForm.prompt = `This is a quiz about ${quizForm.topic}.`;

    const numOptions = Number(quizForm.numberOfOptions);

    // Generate quiz JSON from OpenAI
    getOpenAiJSONResponse(createJSONPrompt(quizForm), numOptions).then(
      (response) => {
        if (response === "CRITICAL_ERROR") {
          window.alert(
            "Something has gone wrong with response generation. Please try again."
          );
          return;
        } else {
          quizForm.quizJSON = response;

          // Build payload WITHOUT teacherId (backend will figure out teacher from JWT)
          const payload = {
            title: quizForm.title,
            description: quizForm.description,
            topic: quizForm.topic,
            numberOfQuestions: Number(quizForm.numberOfQuestions),
            numberOfOptions: numOptions,
            prompt: quizForm.prompt,
            quizJSON: quizForm.quizJSON,
          };

          // Send the data to the server:
          const token: string | undefined =
            localStorage.getItem("token") || "DEFAULT";
          const initHeaders: Headers = new Headers();

          initHeaders.append("Content-Type", "application/json");
          initHeaders.append("Authorization", "Bearer " + token);

          console.log("Quiz payload being sent:", JSON.stringify(payload));

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
                return Promise.reject(
                  `Unexpected Status Code: ${response.status}`
                );
              }
            })
            .then((data) => {
              if (data.quizId) {
                // happy path
                setQuizId(data.quizId);

                // prefer backend JSON if it echoes it back, otherwise use what we sent
                const quizJsonString = data.quizJSON || quizForm.quizJSON;

                addQuestionsAndOptions(
                  quizJsonString,
                  data.quizId,
                  numOptions
                );

                window.alert("Quiz created! Thank you for your patience.");
                navigate("/quizzes");
              } else {
                // unhappy
                setErrors(data);
              }
            })
            .catch(console.log);
        }
      }
    );
  }

  function addQuestionsAndOptions(
    inJSON: string,
    quizId: number,
    numberOfOptions: number
  ) {
    let jsonData: any;

    try {
      jsonData = JSON.parse(inJSON);
    } catch (e) {
      console.error("Failed to parse quiz JSON when adding questions:", e);
      console.error("Offending JSON string:", inJSON);
      window.alert(
        "There was an error processing the quiz questions. Please try again."
      );
      return;
    }

    if (!Array.isArray(jsonData.questions)) {
      console.error("No 'questions' array in quiz JSON.");
      return;
    }

    for (let i = 0; i < jsonData.questions.length; i++) {
      const rawQuestion = jsonData.questions[i];

      const newQuestionForm: QUESTION_OPTIONS = { ...defaultQuestionOptions };
      // Set the quiz ID from the state variable:
      newQuestionForm.quizId = quizId;

      // Get the question text:
      newQuestionForm.questionText = rawQuestion.question;

      let correctAnswer: string = rawQuestion.correct_answer;

      // --- SECOND PASS ENFORCEMENT ON OPTIONS ---
      let options: any[] = Array.isArray(rawQuestion.options)
        ? rawQuestion.options
        : [];

      // Clean out bad values
      options = options
        .filter((o) => typeof o === "string")
        .map((o) => o.trim())
        .filter((o) => o.length > 0);

      // Ensure correct_answer is present
      if (typeof correctAnswer === "string" && correctAnswer.trim().length > 0) {
        if (!options.includes(correctAnswer)) {
          options.unshift(correctAnswer);
        }
      }

      // Remove duplicates while preserving order
      const seen = new Set<string>();
      options = options.filter((o) => {
        if (seen.has(o)) return false;
        seen.add(o);
        return true;
      });

      // Truncate or pad to exactly `numberOfOptions`
      if (options.length > numberOfOptions) {
        options = options.slice(0, numberOfOptions);
      }

      while (options.length < numberOfOptions) {
        const label = String.fromCharCode(65 + options.length); // A, B, C...
        options.push(`Placeholder option ${label} for question ${i + 1}`);
      }

      // Ensure correct_answer is still one of the options
      if (
        typeof correctAnswer === "string" &&
        correctAnswer.trim().length > 0 &&
        !options.includes(correctAnswer)
      ) {
        options[0] = correctAnswer;
      }

      // Overwrite the question's options with the enforced version
      rawQuestion.options = options;

      // Debug: log how many options we ended up with for this question
      console.log(
        `Question ${i + 1}: final options length = ${rawQuestion.options.length}`
      );

      // QUESTION + OPTION
      const token: string | undefined =
        localStorage.getItem("token") || "DEFAULT";
      const initHeaders: Headers = new Headers();

      initHeaders.append("Content-Type", "application/json");
      initHeaders.append("Authorization", "Bearer " + token);

      const init: INIT = {
        method: "POST",
        headers: initHeaders,
        body: JSON.stringify(newQuestionForm),
      };

      // POST the question to the server
      fetch(
        "https://quick-quiz-257248753584.us-central1.run.app/api/questions",
        init
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
          console.log(
            "Added question w/ quiz ID " +
              newQuestionForm.quizId +
              " with text " +
              newQuestionForm.questionText
          );
          if (data.questionId) {
            // happy path – now add options
            for (let j = 0; j < rawQuestion.options.length; j++) {
              const newOptionForm: OPTION_OPTIONS = { ...defaultOptionOptions };

              // Question ID:
              newOptionForm.questionId = data.questionId;

              // Get the option text:
              newOptionForm.optionText = rawQuestion.options[j];
              if (newOptionForm.optionText === correctAnswer) {
                newOptionForm.isCorrect = true;
              } else {
                newOptionForm.isCorrect = false;
              }

              const initOp: INIT = {
                method: "POST",
                headers: initHeaders,
                body: JSON.stringify(newOptionForm),
              };

              // POST the option to the server
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
                .catch(console.log);
            }
          } else {
            // unhappy
            setErrors(data);
          }
        })
        .catch(console.log);
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
          <p>Before creating a quiz, you need to insert your OpenAI Secret Key.</p>
          <p>Please go to 'Insert Your Secret Key' above to do so.</p>
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

          {/* teacherId field removed – backend gets teacher from JWT */}

          <div className="mt-4">
            <button className="btn btn-outline-success mr-4" type="submit">
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
