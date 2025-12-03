import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

interface INIT {
  method: string;
  headers: Headers;
  body: string;
}

// Quiz Options
interface TAKE_QUIZ_OPTIONS {
  [key: string]: number | string | Array<string> | Array<OPTION>;
  questionId: number;
  questionText: string;
  optionList: Array<OPTION>;
  correct_answer: string;
}

interface OPTION {
  optionId: number;
  questionId: number;
  optionText: string;
  quizId: number;
  correct: boolean;
}

// Result Options
interface QUIZ_RESULT_OPTIONS {
  quizResultId?: number; // Optional since it's auto-generated
  userId: number;
  quizId: number;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  optionList: Array<OPTION>;
  questionList: Array<TAKE_QUIZ_OPTIONS>;
  username: string;
  title: string;
  topic: string;
}

let userAnswersTemplate: QUIZ_RESULT_OPTIONS = {
  userId: 0,
  quizId: 0,
  correctAnswers: 0,
  totalQuestions: 0,
  score: 0.0,
  optionList: [],
  questionList: [],
  username: "",
  title: "",
  topic: "",
};

function TakeQuiz() {
  // STATE
  const [quizQuestions, setQuizQuestions] = useState<Array<TAKE_QUIZ_OPTIONS>>(
    []
  );
  const [quizName, setQuizName] = useState<string>("");
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({}); // Using object to store answers
  const [quizResult, setQuizResult] =
    useState<QUIZ_RESULT_OPTIONS>(userAnswersTemplate);
  const [errors, setErrors] = useState<Array<string>>([]);
  const [userId, setUserId] = useState<number>(0);
  const url: string = "https://quick-quiz-257248753584.us-central1.run.app/api/quiz-results";

  const navigate = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    console.log("Quiz ID:", id); // Debug: Check the ID

    if (id) {
      fetch(`https://quick-quiz-257248753584.us-central1.run.app/api/quizzes/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          console.log("Response status:", response.status); // Debug: Log response status
          if (response.status === 200) {
            return response.json();
          } else {
            console.error(`Unexpected Status Code: ${response.status}`);
            return Promise.reject(`Unexpected Status Code: ${response.status}`);
          }
        })
        .then((data) => {
          console.log("Quiz Data: ", data);
          setQuizName(data.title);
          setQuizResult({
            ...quizResult,
            totalQuestions: data.numberOfQuestions,
            title: data.title,
            topic: data.topic,
            quizId: Number(id),
          });
        })
        .catch((error) => console.log("Error fetching quiz data:", error));
      fetch(`https://quick-quiz-257248753584.us-central1.run.app/api/questions/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          console.log("Response status:", response.status); // Debug: Log response status
          if (response.status === 200) {
            return response.json();
          } else {
            console.error(`Unexpected Status Code: ${response.status}`);
            return Promise.reject(`Unexpected Status Code: ${response.status}`);
          }
        })
        .then((data) => {
          console.log("Question Data: ", data);
          setQuizQuestions(data);
        })
        .catch((error) => console.log("Error fetching question data:", error));

      // fetch to get userId
      fetch(`https://quick-quiz-257248753584.us-central1.run.app/api/user/${localStorage.getItem('username')}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          console.log("Response status:", response.status); // Debug: Log response status
          if (response.status === 200) {
            return response.json();
          } else {
            console.error(`Unexpected Status Code: ${response.status}`);
            return Promise.reject(`Unexpected Status Code: ${response.status}`);
          }
        })
        .then((data) => {
          console.log("userId fetch data: ", data);
          setUserId(data.appUserId);
        })
        .catch((error) => console.log("Error fetching question data:", error));
    } else {
      setQuizQuestions([]);
      setQuizName("Pizza Quiz");
      setQuizResult(userAnswersTemplate);
    }
  }, [id]); // Call on ID change


  function handleSubmit(input: React.FormEvent<HTMLFormElement>) {
    input.preventDefault();
    calculateScore();
    addQuizResult();
    navigate('/quizResults');
  }


  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    questionId: number
  ) {
    const { value } = event.target;
    setUserAnswers({ ...userAnswers, [questionId]: value });
  }


  function addQuizResult() {
    const token = localStorage.getItem("token") || "DEFAULT";
    const initHeaders = new Headers();
    initHeaders.append("Content-Type", "application/json");
    initHeaders.append("Authorization", "Bearer " + token);

    const calculatedScore = calculateScore();
    const updatedQuizResult = {
      ...quizResult,
      score: calculatedScore,
      userId: userId,
      questionList: quizQuestions,
      optionList: Object.entries(userAnswers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        optionText: answer,
      })),
      username: localStorage.getItem('username')
    };

    const init: INIT = {
      method: "POST",
      headers: initHeaders,
      body: JSON.stringify(updatedQuizResult),
    };

    console.log("Payload being sent:", JSON.stringify(updatedQuizResult));

    fetch(url, init)
      .then((response) => {
        if (response.status === 201 || response.status === 400) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      })
      .then((data) => {
        if (data.quizResultId) {
          navigate("/");
        } else {
          setErrors(data);
        }
      })
      .catch(console.log);
  }


  function calculateScore() {
    let correctCount: number = 0;

    quizQuestions.forEach((question) => {

      const userAnswer: string = userAnswers[question.questionId];

      const correctOption = question.optionList.find(
        (option) => option.correct
      );

      if (correctOption && userAnswer === correctOption.optionText) {
        correctCount++;
      }
    });

    const scorePercentage: number = (correctCount / quizQuestions.length) * 100;

    setUserAnswers((prevState) => ({
      ...prevState,
      correctAnswers: correctCount,
      score: scorePercentage,
    }));

    return scorePercentage;
  }

  // Render component
  return (
    <>
      <section className="container">
        <h2 className="mb-4">{quizName}</h2>
        {errors.length > 0 && (
          <div className="alert alert-danger">
            <p className="noBackground">The Following Errors Were Found:</p>
            <ul>
              {errors.map((error) => (
                <li className="noBackground" key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Questions:</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {quizQuestions.map((quizQuestion, index) => (
                <tr key={index}>
                  <fieldset>
                    <legend>{quizQuestion.questionText}</legend>
                    {quizQuestion.optionList.map((option) => (
                      <div key={option.optionText}>
                        <input
                          type="radio"
                          id={option.optionText}
                          name={`question-${index}`}
                          value={option.optionText}
                          onChange={(event) =>
                            handleChange(event, quizQuestion.questionId)
                          } // Pass questionId to handleChange
                        />
                        <label htmlFor={option.optionText}>
                          {option.optionText}
                        </label>
                      </div>
                    ))}
                    <p id="noBackground"></p>
                  </fieldset>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <button className="btn btn-outline-success mr-4" type="submit">
              Submit Quiz
            </button>
            <Link
              className="link btn btn-outline-danger"
              to={"/quizzes"}
              type="button"
            >
              Exit Quiz
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}

export default TakeQuiz;
