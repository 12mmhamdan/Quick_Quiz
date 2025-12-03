import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Navbar(){
    const navigate: Function = useNavigate();

    function signOut() {
        if (window.confirm("Do you want to log out?")) {
            localStorage.clear();
            navigate("/");
            window.location.reload();
        }
    }

    if (localStorage.getItem("ROLE_Teacher") === "VALID") {
        return(<>
            <nav>
                <Link to={'/'}>Home</Link>
                <Link to={'/quizResults'}>View Scores</Link>
                <Link to={'/quizzes'}>Browse Quizzes</Link>
                <Link to={'/teacherSecretKey'}>Insert Your Secret Key</Link>
                <Link to={'/quiz/add'}>Create a Quiz</Link>
                <Link to={''} onClick={signOut}>Sign Out</Link>
            </nav>
        </>);
    } else if (localStorage.getItem("ROLE_Student") === "VALID") {
        return(<>
            <nav>
                <Link to={'/'}>Home</Link>
                <Link to={'/quizResults'}>View Scores</Link>
                <Link to={'/quizzes'}>Browse Quizzes</Link>
                <Link to={''} onClick={signOut}>Sign Out</Link>
            </nav>
        </>);
    } else {
        return(<>
            <nav>
                <Link to={'/'}>Home</Link>
                <Link to={'/login'}>Login/Sign Up</Link>
            </nav>
        </>);
    }

    
}

export default Navbar;