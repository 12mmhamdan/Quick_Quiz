import React from "react";
import OpenAI from "openai";
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

interface INIT {
    method: string,
    headers: Headers,
    body: string
}

interface QUIZ_FORM_OPTIONS {
    [key: string]: number | string,
    teacherId: number,
    title: string,
    description: string,
    topic: string,
    numberOfQuestions: number,
    numberOfOptions: number,
    prompt: string,
    quizJSON: string
}

let defaultQuizOptions: QUIZ_FORM_OPTIONS = {
    teacherId: 2,   // Changed from 0
    title: '',
    description: '',
    topic: '',
    numberOfQuestions: 2,
    numberOfOptions: 2,
    prompt: '',
    quizJSON: ''
}

//

interface QUESTION_OPTIONS {
    [key: string]: number | string | string[],
    quizId: number,
    questionText: string,
}

let defaultQuestionOptions: QUESTION_OPTIONS = {
    quizId: -1,
    questionText: '',
}

//

interface OPTION_OPTIONS {
    [key: string]: number | string | Boolean,
    questionId: number,
    optionText: string,
    isCorrect: Boolean
}

let defaultOptionOptions: OPTION_OPTIONS = {
    questionId: -1,
    optionText: '',
    isCorrect: false
}

//

function AddQuiz() {
    // State Variables
    const [quizForm, setQuizForm] = useState<QUIZ_FORM_OPTIONS>(defaultQuizOptions);

    // When an object is created, pass in its ID.
    const [quizId, setQuizId] = useState<number>(-1);
    const [questionId, setQuestionId] = useState<number>(9999);

    const [errors, setErrors] = useState<Array<string>>([]);

    const url: string = 'https://quick-quiz-257248753584.us-central1.run.app/api/quizzes';
    const navigate: Function = useNavigate();

    // We're not loading anything, so no need to use `useEffect()` here.
    // If we are changing anything, we're using the session variable from the User Login.

    // Methods
    function handleSubmit(input: React.FormEvent<HTMLFormElement>) {
        input.preventDefault();

        // Create and add the entire Quiz
        addQuiz();
    }

    function addQuiz() {
        // Create prompt from inputted data:
        // NOTE: The API Prompt is too big for the HTTP request! Switching to a placeholder;
        quizForm.prompt = `This is a quiz about ${quizForm.topic}.`;

        // Debug method. This SHOULD show up in console.log as a double check to ensure that the prompt is correct.
        // console.log(quizForm.prompt);

        // Create and Add Quiz:
        getOpenAiJSONResponse(createJSONPrompt(quizForm)).then(response => {
            if (response === "CRITICAL_ERROR") {
                window.alert("Something has gone wrong with response generation. Please try again.");
                return;
            } else {
                quizForm.quizJSON = response;

                // Send the data to the server:
                const token: string | undefined = sessionStorage.getItem('token') || "DEFAULT";
                const initHeaders: Headers = new Headers();

                initHeaders.append('Content-Type', 'application/json');
                initHeaders.append('Authorization', 'Bearer ' + token)

                console.log(JSON.stringify(quizForm));

                const init: INIT = {
                    method: 'POST',
                    headers: initHeaders,
                    body: JSON.stringify(quizForm)
                }

                fetch(url, init)
                    .then(response => {
                        if (response.status === 201 || response.status === 400) {
                            return response.json();
                        } else {
                            return Promise.reject(`Unexpected Status Code: ${response.status}`);
                        }
                    })
                    .then(data => {
                        if (data.quizId) { // happy path | Change ID name if necessary so it lines up with the backend
                            setQuizId(data.quizId);

                            addQuestionsAndOptions(data.quizJSON, data.quizId);

                            window.alert("Quiz created! Thank you for your patience.");
                            navigate('/quizzes');
                        } else { // unhappy 
                            setErrors(data);
                        }
                    })
                    .catch(console.log)
            }
        })
    }

    function addQuestionsAndOptions(inJSON: string, quizId: number) {
        //console.log(inJSON);
        let jsonData = JSON.parse(inJSON);   // Can't be directly declared as JSON b/c the compiler doesn't like that

        for (let i = 0; i < jsonData.questions.length; i++) {
            const newQuestionForm: QUESTION_OPTIONS = defaultQuestionOptions;
            // Set the quiz ID from the state variable:
            newQuestionForm.quizId = quizId;

            // Get the question text:
            newQuestionForm.questionText = jsonData.questions[i].question;

            let correctAnswer: string = jsonData.questions[i].correct_answer;

            // QUESTION + OPTION
            //////////////////////////////////////////////////////////////////////////////
            const token: string | undefined = sessionStorage.getItem('token') || "DEFAULT";
            const initHeaders: Headers = new Headers();

            initHeaders.append('Content-Type', 'application/json');
            initHeaders.append('Authorization', 'Bearer ' + token)

            const init: INIT = {
                method: 'POST',
                headers: initHeaders,
                body: JSON.stringify(newQuestionForm)
            }


            // POST the question to the server
            fetch('https://quick-quiz-257248753584.us-central1.run.app/api/questions', init)
                .then(response => {
                    if (response.status === 201 || response.status === 400) {
                        return response.json();
                    } else {
                        return Promise.reject(`Unexpected Status Code: ${response.status}`);
                    }
                })
                .then(data => {
                    console.log('Added question w/ quiz ID ' + newQuestionForm.quizId + ' with text ' + newQuestionForm.questionText);
                    if (data.questionId) { // happy path | Change ID name if necessary so it lines up with the backend
                        for (let j = 0; j < jsonData.questions[i].options.length; j++) {
                            const newOptionForm: OPTION_OPTIONS = defaultOptionOptions;

                            // Question ID:
                            newOptionForm.questionId = data.questionId;

                            // Get the option text:
                            newOptionForm.optionText = jsonData.questions[i].options[j];
                            if (newOptionForm.optionText == correctAnswer) {
                                // If the option text is correct, set to True.
                                newOptionForm.isCorrect = true;
                            } else {
                                newOptionForm.isCorrect = false;
                            }

                            const initOp: INIT = {
                                method: 'POST',
                                headers: initHeaders,
                                body: JSON.stringify(newOptionForm)
                            }

                            // POST the option to the server
                            fetch('https://quick-quiz-257248753584.us-central1.run.app/api/options', initOp)
                                .then(response => {
                                    if (response.status === 201 || response.status === 400) {
                                        return response.json();
                                    } else {
                                        return Promise.reject(`Unexpected Status Code: ${response.status}`);
                                    }
                                })
                                .then(data => {
                                    if (data.optionId) { // happy path | Change ID name if necessary so it lines up with the backend
                                        // Do nothing - nothing else needs to be done.
                                    } else { // unhappy 
                                        setErrors(data);
                                    }
                                })
                                .catch(console.log);
                        }
                    } else { // unhappy 
                        setErrors(data);
                    }
                })
                .catch(console.log)
        }
    }

    function handleChange(input: React.FormEvent<HTMLInputElement>) {
        const newQuizForm: QUIZ_FORM_OPTIONS = { ...quizForm };
        newQuizForm[input.currentTarget.name] = input.currentTarget.value;
        setQuizForm(newQuizForm);
    }

    function createJSONPrompt(input: QUIZ_FORM_OPTIONS): string {
        return `Create for me a quiz in a JSON format. The quiz must be multiple-choice. It must be ${input.numberOfQuestions} questions long with ${input.numberOfOptions} options for each question. The quiz must be about ${input.topic}. The format must contain a 'questions' array containing individual questions. Each question in the 'questions' array is made up of three parts: 'question', a string containing the question itself 'options', an array containing answers as a string 'correct_answer', string representing the correct answer Do not include an explanation before or after the JSON code.`;
    }

    async function getOpenAiJSONResponse(input: string): Promise<string> {
        // Create OpenAI using secret key. This SHOULD be a secret (probably set by the Teacher, but we wanted to limited the scope of our project.)

        // Take input from session:
        const openai: OpenAI = new OpenAI({ apiKey: sessionStorage.getItem('secretKey') || "NONE", dangerouslyAllowBrowser: true });


        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    // This should be the prompt input.
                    content: input,
                },
            ],
        });

        if (completion.choices[0].message.content !== null) {
            // Get text from the response to form a valid JSON object.
            let openAIOutput: string = completion.choices[0].message.content
                .replace('```json', '')
                .replace('```', '');

            // Get the JSON in expanded form:
            const jsonObjectExpanded: JSON = JSON.parse(openAIOutput);
            console.log(jsonObjectExpanded);
            // Reduce it to a single line:
            const jsonObjectSingleString: string = JSON.stringify(jsonObjectExpanded);
            console.log(jsonObjectSingleString);

            return jsonObjectSingleString;
        }
        // This should never happen, but we check using this specific string.
        return 'CRITICAL_ERROR';
    }

    // Conditional Rendering:
    if (sessionStorage.getItem("ROLE_Teacher") === null) {
        return (<div className="notfound-container">
            <h1 className="notfound-heading">403</h1>
            <p className="notfound-text">You shouldn't be here!</p>
            <a href="/" className="notfound-link">Go back to Home</a>
          </div>)
    } else if (sessionStorage.getItem("secretKey") === null) {
        return (<>
            <div className="container">
                <p>Before creating a quiz, you need to insert your OpenAI Secret Key.</p>
                <p>Please go to 'Insert Your Secret Key' above to do so.</p>
            </div>
        </>)
    }

    return (<>
        <section className="container">
            <h2 className="mb-4">Create Quiz</h2>

            {errors.length > 0 && (
                <div className="alert alert-danger">
                    <p>The Following Errors Were Found:</p>
                    <ul>
                        {errors.map(error => (
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
                <fieldset className="form-group">
                    <label htmlFor="teacherId">Enter your Teacher ID:</label>
                    <input
                        id="teacherId"
                        name="teacherId"
                        type="number"
                        className="form-control"
                        value={quizForm.teacherId}
                        onChange={handleChange}
                        required
                    />
                </fieldset>
                <div className="mt-4">
                    <button className="btn btn-outline-success mr-4" type="submit">Create Quiz</button>
                    <Link className="link btn btn-outline-danger" to={'/'} type="button">Cancel</Link>
                </div>
            </form>

        </section>
    </>)
}

export default AddQuiz;

