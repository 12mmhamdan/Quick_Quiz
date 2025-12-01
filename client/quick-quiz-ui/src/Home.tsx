import React from "react";

function Home() {

    let getName: string = sessionStorage.getItem('username') || "DEFAULT";
    let displayName: string;
    if (getName === 'DEFAULT') {
        displayName = '';
    } else {
        displayName = ', ' + sessionStorage.getItem('username');
    }


    return (<>
        <div>
            <header>
                <h1 id="imageHeader">Welcome to Quick Quiz{displayName}!</h1>
            </header>
        </div>
        <div className="container">
            <section className="message">
                <p>Quick Quiz is a fast and intuitive way to create and adminster quizzes to your students!</p>
                <p>With just a few clicks, a topic in mind, and access to an OpenAI API key, you too can make a quiz with little to no effort on your part. Save some time for "me" time by registering for our service today!</p>
                <p>Get started now by clicking on the links above.</p>
            </section>
        </div>
        <footer>
            <p>    </p>
            <p>    </p>
            <p>Copyright 2024</p>
            <p>(Image copyright: https://www.pexels.com/photo/schoolchild-solving-elementary-science-test-4022332/, https://www.pexels.com/license/)</p>
        </footer>
    </>)
}

export default Home;