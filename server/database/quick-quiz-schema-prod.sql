-- Drop and recreate the database
DROP DATABASE IF EXISTS quick_quiz;
CREATE DATABASE quick_quiz;
USE quick_quiz;

-- Create app_user table
CREATE TABLE app_user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(2048) NOT NULL,
    disabled BOOLEAN NOT NULL DEFAULT 0
);

-- Create teacher table with a reference to app_user
CREATE TABLE teacher (
    teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    CONSTRAINT fk_teacher_user_id
        FOREIGN KEY (user_id)
        REFERENCES app_user(user_id)
        ON DELETE CASCADE
);

-- Create quiz table with a reference to teacher
CREATE TABLE quiz (
    quiz_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    title VARCHAR(25) NOT NULL,
    description VARCHAR(250) NOT NULL,
    number_of_questions INT NOT NULL,
    number_of_options INT NOT NULL,
    topic VARCHAR(25) NOT NULL,
    prompt VARCHAR(250) NOT NULL,
    quiz_json TEXT NOT NULL,
    CONSTRAINT fk_quiz_teacher_id
        FOREIGN KEY (teacher_id)
        REFERENCES teacher(teacher_id)
        ON DELETE CASCADE
);

-- Create question table with a reference to quiz
CREATE TABLE question (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    question_text VARCHAR(250) NOT NULL,
    CONSTRAINT fk_question_quiz_id
        FOREIGN KEY (quiz_id)
        REFERENCES quiz(quiz_id)
        ON DELETE CASCADE
);

-- Create score table with references to app_user and quiz
CREATE TABLE score (
    score_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_score_user_id
        FOREIGN KEY (user_id)
        REFERENCES app_user(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_score_quiz_id
        FOREIGN KEY (quiz_id)
        REFERENCES quiz(quiz_id)
        ON DELETE CASCADE
);

-- Create option table with a reference to question
CREATE TABLE `option` (
    option_id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    option_text VARCHAR(250),
    is_correct BOOLEAN NOT NULL DEFAULT 0,
    CONSTRAINT fk_option_question_id
        FOREIGN KEY (question_id)
        REFERENCES question(question_id)
        ON DELETE CASCADE
);

-- Create result table with references to app_user, quiz, question, and option
CREATE TABLE result (
    result_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    question_id INT NOT NULL,
    option_id INT NOT NULL,
    CONSTRAINT fk_result_user_id
        FOREIGN KEY (user_id)
        REFERENCES app_user(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_result_quiz_id
        FOREIGN KEY (quiz_id)
        REFERENCES quiz(quiz_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_result_question_id
        FOREIGN KEY (question_id)
        REFERENCES question(question_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_result_option_id
        FOREIGN KEY (option_id)
        REFERENCES `option`(option_id)
        ON DELETE CASCADE
);

CREATE TABLE role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_role (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT pk_user_role PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_role_user_id
        FOREIGN KEY (user_id)
        REFERENCES app_user(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_role_role_id
        FOREIGN KEY (role_id)
        REFERENCES role(role_id)
);

CREATE TABLE quiz_result (
    quiz_result_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    correct_answers INT NOT NULL,
    total_questions INT NOT NULL,
    percent_correct DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_quiz_result_user_id
        FOREIGN KEY (user_id)
        REFERENCES app_user(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_quiz_result_quiz_id
        FOREIGN KEY (quiz_id)
        REFERENCES quiz(quiz_id)
        ON DELETE CASCADE
);

-- Insert data into app_user table
INSERT INTO app_user(user_id, first_name, last_name, username, password, disabled) VALUES
    (1, "Teacher", "Person", "teacherUsername", "password", 0),
    (2, "Student", "Quiztaker", "studentUsername", "password", 0);

-- Insert data into teacher table
INSERT INTO teacher(teacher_id, user_id) VALUES
    (1, 1);

-- Insert data into quiz table
INSERT INTO quiz(quiz_id, teacher_id, title, description, number_of_questions, number_of_options, topic, prompt, quiz_json) VALUES
    (1, 1, "First Quiz", "First Quiz Description", 3, 3, "test", "give me a test quiz with 3 questions and 3 options", '{"questions":[]}');

-- Insert data into question table
INSERT INTO question(question_id, quiz_id, question_text) VALUES
    (1, 1, "First Question"),
    (2, 1, "Second Question"),
    (3, 1, "Third Question");

-- Insert data into score table
INSERT INTO score(score_id, user_id, quiz_id, score) VALUES
    (1, 1, 1, 66.67);

-- Insert data into option table
INSERT INTO `option`(option_id, question_id, option_text, is_correct) VALUES
    (1, 1, "Option 1 for Question 1", 1),
    (2, 1, "Option 2 for Question 1", 0),
    (3, 1, "Option 3 for Question 1", 0),
    (4, 2, "Option 1 for Question 2", 0),
    (5, 2, "Option 2 for Question 2", 1),
    (6, 2, "Option 3 for Question 2", 0),
    (7, 3, "Option 1 for Question 3", 0),
    (8, 3, "Option 2 for Question 3", 0),
    (9, 3, "Option 3 for Question 3", 1);

-- Insert data into result table
INSERT INTO result(result_id, user_id, quiz_id, question_id, option_id) VALUES
    (1, 1, 1, 1, 1),
    (2, 1, 1, 2, 2),
    (3, 1, 1, 3, 1);

-- Insert data into role table
INSERT INTO role(role_id, `name`) VALUES
    (1, "Student"),
    (2, "Teacher");

-- Insert data into user_role table
INSERT INTO user_role(user_id, role_id) VALUES
    (1, 2),
    (2, 1);

-- Insert data into quiz_result table
INSERT INTO quiz_result(quiz_result_id, user_id, quiz_id, correct_answers, total_questions, percent_correct) VALUES
    (1, 2, 1, 2, 3, 66.66);
