import React from "react";
import { useState } from "react";

interface SECRET_KEY_OPTIONS {
    [key: string]: string,
    secretKeyIn: string
}

let defaultSecretKey: SECRET_KEY_OPTIONS = {
    secretKeyIn: ''
}

function TeacherInsertSecretKey() {
    // State Variable
    const [secretKey, setSecretKey] = useState<SECRET_KEY_OPTIONS>(defaultSecretKey);

    function handleSubmit(input: React.FormEvent<HTMLFormElement>) {
        input.preventDefault();
        if (input.currentTarget.value === '') {
            window.alert("Empty input. Please enter your Secret Key.")
        }
        setSecretKeyInSessionStorage(secretKey.secretKeyIn);
        window.alert("Secret key set! Please go to 'Create A Quiz' to make a quiz.");
        window.location.reload();
    }

    function handleChange(input: React.FormEvent<HTMLInputElement>) {
        const newSecretKey: SECRET_KEY_OPTIONS = { ...secretKey };
        newSecretKey[input.currentTarget.name] = input.currentTarget.value;
        setSecretKey(newSecretKey);
    }

    // Helper function:
    function setSecretKeyInSessionStorage(input: string) {
        // Set the Teacher's OpenAI Secret Key
        sessionStorage.setItem('secretKey', input);
    }

    if (sessionStorage.getItem("ROLE_Teacher") === null) {
        return (<div className="notfound-container">
            <h1 className="notfound-heading">403</h1>
            <p className="notfound-text">You shouldn't be here!</p>
            <a href="/" className="notfound-link">Go back to Home</a>
          </div>)
    }

    return (<>
        <section className="container">
            <h2 className="mb-4">Your Secret Key</h2>
            <p>Insert your OpenAI Secret Key here.</p>
            <p>If you do not have a Secret Key and need to get one or want to know more, use these buttons to open a new tab and login to OpenAI:</p>
            <a className="btn btn-outline-primary btn-lg  mb-4" href="https://openai.com/" role="button">OpenAI</a>
            <p>Afterward, generate a new Secret Key:</p>
            <a className="btn btn-outline-primary btn-lg  mb-4" href="https://platform.openai.com/api-keys">Get New API Key</a>
            <p>Your stored scecret key is:</p>
            <p>{"(Hiding for demonstration: " + sessionStorage.getItem('secretKey')?.substring(0, 20) + 
            " ...)" || "None"}</p>
            <form onSubmit={handleSubmit}>
                <fieldset className="form-group">
                    <label htmlFor="secretKeyIn">Insert Secret Key here:</label>
                    <input
                        id="secretKeyIn"
                        name="secretKeyIn"
                        type="password"
                        className="form-control"
                        value={secretKey.secretKeyIn}
                        onChange={handleChange}
                    />
                </fieldset>
                <div>
                    <button className="btn btn-outline-success mr-4" type="submit">Submit</button>
                </div>
            </form>
        </section>
    </>)
}

export default TeacherInsertSecretKey;