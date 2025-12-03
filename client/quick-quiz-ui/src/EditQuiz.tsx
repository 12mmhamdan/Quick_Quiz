import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

interface INIT {
    method: string,
    headers: Headers,
    body: string
}

// Variables needed to render each question
interface TAKE_QUIZ_OPTIONS {
    [key: string]: number | string | Array<string> | Array<OPTION>,
    questionId: number,
    questionText: string,
    optionList: Array<OPTION>,
    correct_answer: string
}

interface OPTION {
    optionId: number,
    questionId: number,
    optionText: string,
    quizId: number,
    correct: boolean
}

function EditQuiz() {
    // State
    const [questions, setQuestions] = useState<Array<TAKE_QUIZ_OPTIONS>>([]);
    const [errors, setErrors] = useState<Array<string>>([]);
    const url: string = 'https://quick-quiz-257248753584.us-central1.run.app/api/questions';

    const navigate: Function = useNavigate();
    const { id } = useParams();

    console.log(questions);

    // useEffect
    useEffect(() => {
        if (id) {
            fetch(`${url}/${id}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        return Promise.reject(`Unexpected Status Code: ${response.status}`);
                    }
                })
                .then(data => {
                    // Get the "questions" array from "quiz"
                    console.log(data);
                    setQuestions(data);
                })
                .catch(console.log);
        } else {
            setQuestions([]); // Empty array b/c nothing was found at the given "id"
        }
    }, [id]);

    function handleSubmit(input: React.FormEvent<HTMLFormElement>) {
        input.preventDefault();
        updateQuestions();
    }


    // All three fields are required.
    function handleChange(input: React.FormEvent<HTMLInputElement>) {
        const newQuestions: TAKE_QUIZ_OPTIONS[] = [...questions];

        // Brute force, update if we have time. 
        // Consider replacing these if statements and go for 'find()'.
        // I just want the code functional so I can look into implementing Security.

        if (input.currentTarget.name === 'question' || input.currentTarget.name === 'correct_answer') {
            // Check below. index of the map is passed into 'id' as a string, convert back to number to get the array index
            questions[parseInt(input.currentTarget.id)]["questionText"] = input.currentTarget.value;
        } else if (input.currentTarget.name === 'currentOption') {
            // id={index.toString(10),indexOp.toString(10)}
            let strIndexes: string[] = input.currentTarget.id.split(',');
            // index of newQuestions, index of Options

            // For readability:
            let questionIndex: number = parseInt(strIndexes[0]);
            let optionIndex: number = parseInt(strIndexes[1]);

            questions[questionIndex].optionList[optionIndex] = { ...questions[questionIndex].optionList[optionIndex], optionText: input.currentTarget.value };
        } else if (input.currentTarget.type === 'checkbox'){
            let strIndexes: string[] = input.currentTarget.id.split(',');
            let questionIndex: number = parseInt(strIndexes[0]);
            let optionIndex: number = parseInt(strIndexes[1]);

            questions[questionIndex].optionList[optionIndex] = { ...questions[questionIndex].optionList[optionIndex], correct: input.currentTarget.checked };
        }
        setQuestions(newQuestions);
    }

    // Update
    function updateQuestions() {
        const token: string | undefined = localStorage.getItem('token') || "DEFAULT";
        const initHeaders: Headers = new Headers();
        initHeaders.append('Content-Type', 'application/json');
        initHeaders.append('Authorization', "Bearer " + token)


        questions.forEach(question => {
            const init: INIT = {
                method: 'PUT',
                headers: initHeaders,
                body: JSON.stringify(question)
            }

            fetch(`${url}/${question.questionId}`, init)
                .then(response => {
                    if (response.status === 204) {
                        return null;
                    } else if (response.status === 400) {
                        return response.json();
                    } else {
                        return Promise.reject(`Unexpected Status Code ${response.status}`);
                    }
                })
                .then(data => {
                    if (!data) { // happy 
                    } else {
                        setErrors(data);
                    }
                })
                .catch(console.log)

            question.optionList.forEach(option => {
                const init2: INIT = {
                    method: 'PUT',
                    headers: initHeaders,
                    body: JSON.stringify(option)
                }

                fetch(`${"https://quick-quiz-257248753584.us-central1.run.app/api/options"}/${option.optionId}`, init2)
                    .then(response => {
                        console.log(option);
                        console.log(`${url}/${option.optionId}`);
                        if (response.status === 204) {
                            return null;
                        } else if (response.status === 400) {
                            return response.json();
                        } else {
                            return Promise.reject(`Unexpected Status Code ${response.status}`);
                        }
                    })
                    .then(data => {
                        if (!data) { // happy 
                            navigate('/quizzes');
                        } else {
                            setErrors(data);
                        }
                    })
                    .catch(console.log)

            });
        });


    }

    /*
    For reference:
    interface TAKE_QUIZ_OPTIONS {
        question: string,
        options: Array<string>,
        correct_answer: string
    }
    */

    // This URL is open, so first we should check if the user's supposed to be here.
    if (localStorage.getItem("ROLE_Teacher") === null) {
        return (<div className="notfound-container">
            <h1 className="notfound-heading">403</h1>
            <p className="notfound-text">You shouldn't be here!</p>
            <a href="/" className="notfound-link">Go back to Home</a>
          </div>)
    }

    return (<>
        <section className="container">
            <h2 className="mb-4">Edit Quiz</h2>

            {errors.length > 0 && (
                <div className="alert alert-danger">
                    <p className="noBackground">The Following Errors Were Found:</p>
                    <ul>
                        {errors.map(error => (
                            <li className="noBackground" key={error}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {questions.map((currentQuestion, index) => (
                    <div>
                        <hr />
                        <fieldset className="form-group">
                            <label htmlFor="question">Question {index + 1}:</label>
                            <input
                                id={index.toString(10)}
                                name="question"
                                type="text"
                                className="form-control"
                                value={currentQuestion.questionText}
                                onChange={handleChange}
                                required
                            />
                        </fieldset>
                        {currentQuestion.optionList.map((currentOption, indexOp) =>
                            <div className="">
                                <fieldset className="form-group d-flex">
                                    <div>
                                        <label htmlFor="currentOption">Option {indexOp + 1}:</label>
                                        <input
                                            id={index.toString(10) + "," + indexOp.toString(10)}
                                            name="currentOption"
                                            type="text"
                                            className="form-control"
                                            value={currentOption.optionText}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="correct">Is correct?</label>
                                        <input
                                            id={index.toString(10) + "," + indexOp.toString(10) + "check"}
                                            name="correct"
                                            type="checkbox"
                                            className="form-control"
                                            checked={currentOption.correct}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </fieldset>
                            </div>
                        )}
                    </div>

                ))}
                <hr />
                <div className="mt-4">
                    <button className="btn btn-outline-success mr-4" type="submit">Confirm Edits</button>
                    <Link className="link btn btn-outline-danger" to={'/quizzes'} type="button">Exit Quiz</Link>
                </div>
            </form>
        </section>
    </>)
}

export default EditQuiz;