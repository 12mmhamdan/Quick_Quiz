import React from "react";
import { useEffect, useState } from "react";

interface INIT {
    method: string,
    headers: Headers,
    body: string
}

interface QUIZ_RESULTS_OPTIONS {
    id: number,
    username: string,
    title: string,
    topic: string,
    score: number
}

function QuizResultsList() {
    // State Variables
    const [quizResults, setQuizResults] = useState<Array<QUIZ_RESULTS_OPTIONS>>([]);
    const [errors, setErrors] = useState<Array<string>>([]);

    const url: string = 'https://quick-quiz-257248753584.us-central1.run.app/api/quiz-results';

    useEffect(() => {
        fetch(url, {
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            }
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
                setQuizResults(data)
            })
            .catch(console.log)
    }, []); // call me only once on page load

    // UPDATE / PUT score to -1 (not taken)
    function handleResetScore(input: number) {
        const quizResult = quizResults.find(qr => qr.id === input) ?? null;
        if (quizResult) {
            quizResult.score = -1;
            if (window.confirm(`Reset ${quizResult.username}'s score for Quiz ${quizResult.title}?`)) {
                const token: string | undefined = sessionStorage.getItem
                    ('token') || "DEFAULT";
                const initHeaders: Headers = new Headers();
                initHeaders.append('Authorization', token);
                initHeaders.append('Content-Type', 'application/json');

                const init: INIT = {
                    method: 'POST',
                    headers: initHeaders,
                    body: JSON.stringify(quizResult)
                }
                fetch(`${url}/${input}`, init)
                    .then(response => {
                        if (response.status === 204) {
                            return response.json();
                        } else if (response.status === 400) {
                            return response.json();
                        } else {
                            return Promise.reject(`Unexpected Status Code ${response.status}`);
                        }
                    })
                    .then(data => {
                        if (!data) { // happy 
                            // TODO: Set quiz results here 
                            window.location.reload(); // Refresh the page
                        } else {
                            setErrors(data);
                        }
                    })
                    .catch(console.log)
            }
        }
    }

    /*
    For reference:
    interface SCORES_OPTIONS {
    username: string,
    title: string,
    topic: string,
    score: number
    }
    */

    if (sessionStorage.getItem("Teacher") === "VALID") {
        return (<>
            <section className="container">
                <h2 className="mb-4">Quiz Grades</h2>
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Username</th>
                            <th>Quiz Title</th>
                            <th>Topic</th>
                            <th>Score</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizResults.map(quizResult => (
                            <tr key={quizResult.id}>
                                <td>{quizResult.username}</td>
                                <td>{quizResult.title}</td>
                                <td>{quizResult.topic}</td>
                                <td>{quizResult.score}</td>
                                <td>
                                    <button className="btn btn-outline-danger" onClick={() => handleResetScore(quizResult.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>)
    } else {
        return (<>
            <section className="container">
                <h2 className="mb-4">Quiz Grades</h2>
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Username</th>
                            <th>Quiz Title</th>
                            <th>Topic</th>
                            <th>Score</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizResults.map(quizResult => (
                            <tr key={quizResult.id}>
                                <td>{quizResult.username}</td>
                                <td>{quizResult.title}</td>
                                <td>{quizResult.topic}</td>
                                <td>{quizResult.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>)
    }

}

export default QuizResultsList;