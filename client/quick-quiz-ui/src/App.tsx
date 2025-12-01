import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import AddQuiz from "./AddQuiz";
import EditQuiz from "./EditQuiz";
import QuizList from "./QuizList";
import NotFound from "./NotFound";
import QuizResultsList from "./QuizResultsList";
import TakeQuiz from "./TakeQuiz";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import TeacherSecretKey from "./TeacherInsertSecretKey";

function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/quiz/add" element={<AddQuiz/>}/>
          <Route path="/quiz/edit/:id" element={<EditQuiz/>}/>
          <Route path="/quizzes" element={<QuizList/>}/>
          <Route path="/takeQuiz/:id" element={<TakeQuiz/>}/>
          <Route path="/quizResults" element={<QuizResultsList/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/teacherSecretKey" element={<TeacherSecretKey/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
