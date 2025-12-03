import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface INIT_DELETE {
    method: string,
    headers: Headers
}

interface QUIZ_LIST_OPTIONS {
    quizId: number,
    teacherName: string,
    title: string,
    topic: string,
    numberOfQuestions: number
}

let demoQuizzes: QUIZ_LIST_OPTIONS[] = [
    {
        quizId: 1,
        teacherName: 'Escano',
        title: 'Pizza Quiz',
        topic: 'Pizza',
        numberOfQuestions: 2
    },
    {
        quizId: 2,
        teacherName: 'Escano',
        title: 'Gaming Quiz',
        topic: 'Gaming',
        numberOfQuestions: 25
    },
]

function QuizList() {
    // State
    const [quizzes, setQuizzes] = useState<Array<QUIZ_LIST_OPTIONS>>([]);
    // For demonstration:
    // const [quizzes, setQuizzes] = useState<Array<QUIZ_LIST_OPTIONS>>(demoQuizzes);
    const url: string = 'https://quick-quiz-257248753584.us-central1.run.app/api/quizzes';


    const initHeaders: Headers = new Headers();
    initHeaders.append('Content-Type', 'application/json');
    initHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));


    useEffect(() => {
        fetch(url, {
            method: 'GET',
            headers: initHeaders
        })
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject(`Unexpected Status Code: ${response.status}`);
                }
            })
            .then(data => {
                console.log(data);
                setQuizzes(data)
            })
            .catch(console.log)
    }, []); // call me only once on page load

    // PUT a quiz is handled in EditQuiz.

    // DELETE a quiz:
    function handleDeleteQuiz(quizId: number) {
        const quiz = quizzes.find(q => q.quizId === quizId);
        if (quiz) {
            if (window.confirm(`Delete Quiz: ${quiz.title}?`)) {
                const token: string | undefined = localStorage.getItem
                    ('token') || "DEFAULT";
                const initHeaders: Headers = new Headers();
                initHeaders.append('Authorization', 'Bearer ' + token);
                const init: INIT_DELETE = {
                    method: 'DELETE',
                    headers: initHeaders
                };
                fetch(`${url}/${quizId}`, init)
                    .then(response => {
                        if (response.status === 204) {
                            // Renove the quiz
                            const newQuizzes = quizzes.filter(q => q.quizId !== quizId);
                            // Update the quizzes state
                            setQuizzes(newQuizzes);
                        } else {
                            return Promise.reject(`Unexpected Status Code: ${response.status}`);
                        }
                    })
                    .catch(console.log)
            }
        }
    }

    // &nbsp; for the buttons
    // Render three versions: Teacher, Student, not logged in
    if (localStorage.getItem("ROLE_Teacher") === "VALID") {
        return (<>
            <section className="container">
                <h2 className="mb-4">Available Quizzes:</h2>
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Teacher</th>
                            <th>Quiz Name</th>
                            <th>Topic</th>
                            <th>Number of Questions</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map(quiz => (
                            <tr key={quiz.quizId}>
                                <td>{quiz.teacherName}</td>
                                <td>{quiz.title}</td>
                                <td>{quiz.topic}</td>
                                <td>{quiz.numberOfQuestions}</td>
                                <td>
                                    <Link className="link btn btn-primary mr-4" to={`/takeQuiz/${quiz.quizId}`}>Take Quiz</Link>
                                    <Link className="link btn btn-warning mr-4" to={`/quiz/edit/${quiz.quizId}`}>Update</Link>
                                    <button className="btn btn-danger" onClick={() => handleDeleteQuiz(quiz.quizId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>);
    } else if (localStorage.getItem("ROLE_Student") === "VALID") {
        return (<>
            <section className="container">
                <h2 className="mb-4">Available Quizzes:</h2>
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Teacher</th>
                            <th>Quiz Name</th>
                            <th>Topic</th>
                            <th>Number of Questions</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map(quiz => (
                            <tr key={quiz.quizId}>
                                <td>{quiz.teacherName}</td>
                                <td>{quiz.title}</td>
                                <td>{quiz.topic}</td>
                                <td>{quiz.numberOfQuestions}</td>
                                <td>
                                    <Link className="link btn btn-primary mr-4" to={`/takeQuiz/${quiz.quizId}`}>Take Quiz</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>);
    } else {
        return (<div className="notfound-container">
            <h1 className="notfound-heading">403</h1>
            <p className="notfound-text">You shouldn't be here!</p>
            <a href="/" className="notfound-link">Go back to Home</a>
          </div>)
    }


}

export default QuizList;