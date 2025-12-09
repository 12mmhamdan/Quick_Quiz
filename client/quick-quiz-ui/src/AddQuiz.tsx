import React, { useState } from "react";
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

// === Helpers ===

const API_BASE = "https://quick-quiz-257248753584.us-central1.run.app";

function getFromStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

// Normalize quiz JSON: enforce exactly `numberOfOptions` per question
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

  let parsed: QuizShape;

  try {
    parsed = JSON.parse(rawJson);
  } catch (e) {
    console.error("Failed to parse OpenAI JSON in normalizeQuizJson:", e);
    console.error("Raw JSON that failed:", rawJson);
    throw e;
  }

  if (!Array.isArray(parsed.questions)) {
    console.error("Parsed JSON has no 'questions' array.");
    throw new Error("Parsed JSON has no 'questions' array.");
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
      const label = String.fromCharCode(65 + q.options.length); // A, B, C, ...
      q.options.push(`Placeholder option ${label} for question ${index + 1}`);
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

// Call your backend AI endpoint (no direct OpenAI call from browser)
async function getOpenAiJSONResponse(
  input: string,
  numberOfOptions: number
): Promise<string> {
  const storedToken = getFromStorage("token");
  if (!storedToken) {
    throw new Error("No auth token found. Please log in again.");
  }

  // Handle both raw token and "Bearer <token>"
  const rawToken = storedToken.trim().replace(/^Bearer\s+/i, "");
  const authHeader = `Bearer ${rawToken}`;

  const res = await fetch(`${API_BASE}/api/ai/generate-quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({
      prompt: input,
      numberOfOptions,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Backend AI endpoint error:", res.status, text);
    throw new Error(`Backend AI endpoint failed: ${res.status}`);
  }

  const data = (await res.json()) as { quizJson: string };

  // Clean/normalize here
  try {
    const normalized = normalizeQuizJson(data.quizJson, numberOfOptions);
    console.log("Normalized quiz JSON:", JSON.parse(normalized));
    return normalized;
  } catch (e) {
    console.error("Error during JSON normalization:", e);
    console.error("Cleaned content that failed to normalize:", data.quizJson);
    // Fallback: return original string (might still be usable / debuggable)
    return data.quizJson;
  }
}

// Build the prompt sent to the AI
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

// === Component ===

function AddQuiz() {
  const [quizForm, setQuizForm] =
    useState<QUIZ_FORM_OPTIONS>(defaultQuizOptions);

  const [quizId, setQuizId] = useState<number>(-1);

  const [errors, setErrors] = useState<Array<string>>([]);

  const navigate = useNavigate();

  // Submit handler
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);

    try {
      await addQuiz();
    } catch (err: any) {
      console.error("Error creating quiz:", err);
      setErrors([err?.message || "An unexpected error occurred."]);
    }
  }

  async function addQuiz() {
    // Build prompt
    const prompt = createJSONPrompt(quizForm);
    quizForm.prompt = `This is a quiz about ${quizForm.topic}.`;

    // 1) Get quiz JSON from backend AI endpoint
    const quizJsonFromAi = await getOpenAiJSONResponse(
      prompt,
      Number(quizForm.numberOfOptions)
    );
    quizForm.quizJSON = quizJsonFromAi;

    // 2) Build payload for /api/quizzes (backend derives teacher_id from JWT)
    const payload = {
      title: quizForm.title,
      description: quizForm.description,
      topic: quizForm.topic,
      numberOfQuestions: Number(quizForm.numberOfQuestions),
      numberOfOptions: Number(quizForm.numberOfOptions),
      prompt: quizForm.prompt,
      quizJSON: quizForm.quizJSON,
    };

    const storedToken = getFromStorage("token");
    if (!storedToken) {
      throw new Error("No auth token found. Please log in again.");
    }
    const rawToken = storedToken.trim().replace(/^Bearer\s+/i, "");
    const authHeader = `Bearer ${rawToken}`;

    const initHeaders: Headers = new Headers();
    initHeaders.append("Content-Type", "application/json");
    initHeaders.append("Authorization", authHeader);

    const init: INIT = {
      method: "POST",
      headers: initHeaders,
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${API_BASE}/api/quizzes`, init);

    if (response.status === 201 || response.status === 400) {
      const data = await response.json();

      if (response.status === 400) {
        // validation errors from backend
        if (Array.isArray(data)) {
          setErrors(data);
        } else {
          setErrors(["Validation error while creating quiz."]);
        }
        return;
      }

      // 201 Created
      if (data.quizId && data.quizJSON) {
        setQuizId(data.quizId);
        await addQuestionsAndOptions(data.quizJSON, data.quizId);
        window.alert("Quiz created! Thank you for your patience.");
        navigate("/quizzes");
      } else {
        setErrors(["Unexpected response from quiz creation endpoint."]);
      }
    } else if (response.status === 403) {
      console.error("Forbidden (403) from backend.");
      throw new Error("You are not authorized to create quizzes.");
    } else {
      throw new Error(`Unexpected Status Code: ${response.status}`);
    }
  }

  async function addQuestionsAndOptions(inJSON: string, quizId: number) {
    let jsonData: any;

    try {
      jsonData = JSON.parse(inJSON);
    } catch (e) {
      console.error("Failed to parse quiz JSON returned from backend:", e);
      setErrors(["Failed to parse quiz JSON returned from server."]);
      return;
    }

    if (!Array.isArray(jsonData.questions)) {
      console.error("No 'questions' array in quiz JSON.");
      setErrors(["Quiz JSON from server did not contain questions."]);
      return;
    }

    const storedToken = getFromStorage("token");
    if (!storedToken) {
      throw new Error("No auth token found. Please log in again.");
    }
    const rawToken = storedToken.trim().replace(/^Bearer\s+/i, "");
    const authHeader = `Bearer ${rawToken}`;

    const initHeaders: Headers = new Headers();
    initHeaders.append("Content-Type", "application/json");
    initHeaders.append("Authorization", authHeader);

    for (let i = 0; i < jsonData.questions.length; i++) {
      const q = jsonData.questions[i];

      const options = q.options;
      if (!Array.isArray(options) || options.length === 0) {
        console.warn(`Question ${i + 1} has no options.`);
        continue;
      }

      const newQuestionForm: QUESTION_OPTIONS = {
        ...defaultQuestionOptions,
      };
      newQuestionForm.quizId = quizId;
      newQuestionForm.questionText = q.question;

      let correctAnswer: string = q.correct_answer;

      const questionInit: INIT = {
        method: "POST",
        headers: initHeaders,
        body: JSON.stringify(newQuestionForm),
      };

      // POST the question to the server
      const questionRes = await fetch(`${API_BASE}/api/questions`, questionInit);
      if (questionRes.status !== 201 && questionRes.status !== 400) {
        console.error(
          `Unexpected Status Code when creating question: ${questionRes.status}`
        );
        continue;
      }

      const questionData = await questionRes.json();
      console.log(
        "Added question w/ quiz ID " +
          newQuestionForm.quizId +
          " with text " +
          newQuestionForm.questionText
      );

      if (!questionData.questionId) {
        setErrors(["Failed to create a question on the server."]);
        continue;
      }

      // Now add options
      for (let j = 0; j < options.length; j++) {
        const newOptionForm: OPTION_OPTIONS = {
          ...defaultOptionOptions,
        };

        newOptionForm.questionId = questionData.questionId;
        newOptionForm.optionText = options[j];
        newOptionForm.isCorrect = options[j] === correctAnswer;

        const optionInit: INIT = {
          method: "POST",
          headers: initHeaders,
          body: JSON.stringify(newOptionForm),
        };

        const optionRes = await fetch(`${API_BASE}/api/options`, optionInit);
        if (optionRes.status !== 201 && optionRes.status !== 400) {
          console.error(
            `Unexpected Status Code when creating option: ${optionRes.status}`
          );
          continue;
        }

        const optionData = await optionRes.json();
        if (!optionData.optionId) {
          setErrors(["Failed to create an option on the server."]);
        }
      }
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

  // === Conditional Rendering: only teachers can be here ===
  const hasTeacherRole =
    getFromStorage("ROLE_Teacher") !== null ||
    (typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("ROLE_Teacher") !== null);

  if (!hasTeacherRole) {
    return (
      <div className="notfound-container">
        <h1 className="notfound-heading">403</h1>
        <p className="notfound-text">You shouldn't be here!</p>
        <a href="/" className="notfound-link">
          Go back to Home
        </a>
      </div>
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

        <form onSubmit={onSubmit}>
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
