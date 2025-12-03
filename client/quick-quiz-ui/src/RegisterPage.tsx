import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface INIT {
    method: string,
    headers: Headers,
    body: string
}

interface LOGIN_OPTIONS {
    [key: string]: string | string[],      // NOTE: other interfaces must have string | number
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    roles: string[]
}

let defaultLogin: LOGIN_OPTIONS = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    roles: ["Student"]   // default role
}

function RegisterPage() {
    const [loginInfo, setLoginInfo] = useState<LOGIN_OPTIONS>(defaultLogin);
    const [errors, setErrors] = useState<Array<string>>([]);

    const url: string = 'https://quick-quiz-257248753584.us-central1.run.app/api/user/register';
    const navigate: Function = useNavigate()

    function handleSubmit(input: React.FormEvent<HTMLFormElement>) {
        input.preventDefault();
        addNewUser();
    }

    function handleChange(input: React.FormEvent<HTMLInputElement>) {
        const newLoginInfo: LOGIN_OPTIONS = { ...loginInfo };
        newLoginInfo[input.currentTarget.name] = input.currentTarget.value;
        setLoginInfo(newLoginInfo);
    }

    function handleRoleChange(input: React.ChangeEvent<HTMLSelectElement>) {
        const role = input.currentTarget.value; // "Student" or "Teacher"
        const newLoginInfo: LOGIN_OPTIONS = { ...loginInfo, roles: [role] };
        setLoginInfo(newLoginInfo);
    }

    // Attempt to add the new user:
    function addNewUser() {
        const initHeaders: Headers = new Headers();
        initHeaders.append('Content-Type', 'application/json');
        const init: INIT = {
            method: 'POST',
            headers: initHeaders,
            body: JSON.stringify(loginInfo)
        }

        fetch(url, init)
            .then(response => {
                if (response.status === 201) {    // Response code from the Agent Security example
                    return null;
                }  else {
                    return response.json();
                }
            })
            .then(data => {
                if (!data) {
                    window.alert('Success! Please log in with your new account.')
                    navigate('/login');
                } else {
                    setErrors(data);
                }
            })
            .catch(console.log);
    }

    return (<>
        <section className="container">
            <h2 className="mb-4">Create User:</h2>
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
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        className="form-control"
                        value={loginInfo.firstName}
                        onChange={handleChange}
                    />
                </fieldset>
                <fieldset className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        className="form-control"
                        value={loginInfo.lastName}
                        onChange={handleChange}
                    />
                </fieldset>
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

                {/* New role selector */}
                <fieldset className="form-group">
                    <label htmlFor="role">Account Type</label>
                    <select
                        id="role"
                        name="role"
                        className="form-control"
                        value={loginInfo.roles[0]}   // "Student" or "Teacher"
                        onChange={handleRoleChange}
                    >
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                    </select>
                </fieldset>

                <div className="mt-3">
                    <button className="btn btn-outline-success mr-4" type="submit">Sign Up</button>
                    <Link className="link btn btn-outline-danger" to={'/login'} type="button">Cancel</Link>
                </div>
            </form>
        </section>

    </>)
}

export default RegisterPage;
