import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface INIT {
    method: string,
    headers: Headers,
    body: string
}

interface LOGIN_OPTIONS {
    [key: string]: string,
    username: string,
    password: string
}

let defaultLogin: LOGIN_OPTIONS = {
    username: '',
    password: ''
}

function LoginPage() {
    // State Variables
    const [loginInfo, setLoginInfo] = useState<LOGIN_OPTIONS>(defaultLogin);
    const [errors, setErrors] = useState<Array<string>>([]);
    const url: string = 'https://quick-quiz-257248753584.us-central1.run.app/api/user/authenticate';

    const navigate: Function = useNavigate();

    // We don't need useEffect here since we don't need to retieve data, we're just sending data to the server.

    function handleSubmit(input: React.FormEvent<HTMLFormElement>) {
        input.preventDefault();
        attemptLogin();
    }

    function handleChange(input: React.FormEvent<HTMLInputElement>) {
        const newLoginInfo: LOGIN_OPTIONS = { ...loginInfo };
        newLoginInfo[input.currentTarget.name] = input.currentTarget.value;
        setLoginInfo(newLoginInfo);
    }

    // Attempt to login:
    function attemptLogin() {
        const initHeaders: Headers = new Headers();
        initHeaders.append('Content-Type', 'application/json');
        const init: INIT = {
            method: 'POST',
            headers: initHeaders,
            body: JSON.stringify(loginInfo)
        }

        fetch(url, init)
            .then(response => {
                if (response.status === 200) {
                    return response.json(); // This will contain the Java Token used in the headers
                } else if (response.status === 403) {
                    return Promise.reject(`${response.status} | Invalid username and login.`);
                } else {
                    return Promise.reject(`Unexpected Status Code ${response.status}`);
                }
            })
            .then(data => {
                if (data) {
                    setSessionStorage(data);
                    navigate('/');
                } else {
                    setErrors(data);
                }
            })
            .catch(console.log);
    }

    // Helper function:

    // Set Session Storage
    // If successful, set session storage.
    // This will allow us to use the created token, username, and roles anywhere in the project!
    function setSessionStorage(input: any) {
        // 1. Get Roles from the token
        // Decode the token to get its data.
        let token: string = input.jwt_token;
        let tokenBody: string = token.split('.')[1];      // This is the token returned form the HTTP request
        let jsonStr: string  = atob(tokenBody);
        let json = JSON.parse(jsonStr);
        console.log(token);
        console.log(jsonStr);
        console.log(json.authorities);  // Not using TypeScript here, unable to get 'authorities' otherwise
        
        // Only ROLE_Teacher or ROLE_Student
        sessionStorage.setItem(json.authorities, 'VALID');

        
        // https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
        // sessionStorage.getItem(key, value)
        // If the key exists, return the value. 
        // If the key does not exist, return `null`.

        // https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('username', loginInfo.username);
    }

    return (<>
        <section className="container">
            <h2 className="mb-4">Login:</h2>
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
                <fieldset className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        className="form-control"
                        value={loginInfo.username}
                        onChange={handleChange}
                    />
                </fieldset>
                <fieldset className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-control"
                        value={loginInfo.password}
                        onChange={handleChange}
                    />
                </fieldset>
                <div>
                    <button className="loginButton" type="submit">Login</button>
                </div>
            </form>
            <div className="mt-4">
                <Link className="registerButton" to={'/register'} type="button">Not registered? Sign up now!</Link>
            </div>
        </section>

    </>)
}

export default LoginPage;