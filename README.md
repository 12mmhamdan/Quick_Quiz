# Quick Quiz (Q_Q)

## Technologies
* One API call to an AI Model to get a JSON formatted response
    * i.e. ChatGPT, Google Gemini
* Typescript

## 1. Problem Statement
* Teachers often face significant time constraints, making creating high-quality quizzes that effectively assess student learning challenging. The traditional methods of quiz creation, review, and management are time-consuming and require considerable effort. 
* With this increasing workload, teachers need a solution that simplifies the quiz-making process while maintaining the quality and accuracy of assessments.
* "Quick Quiz" will help teachers efficiently design and manage quizzes while maintaining full control over the content, allowing customization to suit individual classroom needs.
    * It will enable educators to save time, streamline their workflow, and focus more on teaching and student engagement rather than administrative tasks. 

## 2. Technical Solution
* Create a simple and accessible application that creates multiple-choice quizzes for users (STUDENTS and TEACHERS, for testing) to take. 
* The application takes three inputs from a TEACHER (admin) to create the quiz:
    * Number of questions per quiz (number)
    * Number of answers per question (number)
    * The topic of the quiz (string)
* The quizzes must be editable and deletable by a TEACHER.
* All users can view and take quizzes.
* STUDENTS can view scores for the quizzes they've taken.
* TEACHERS can view all scores for all quizzes taken and reset individual scores in case an error occurs.

## 2.1 Scenarios
* Scenario 1:
    * Moataz teaches economics at his high school and he needs a quick pop quiz to refresh his students on real estate investment and development. The quiz should be short, so he uses the “Quick Quiz” app to create a short five-question quiz about real estate for students to take when they walk into class. 
    * Each question has four answers by default, so he only has to input five questions and the topic of "real estate" before generating the quiz. 
    * His students then take the quiz the next morning, but something goes wrong with one of his student's laptops and it dies in class.
    * Thankfully, Moataz is able to reset the student's score so that they can retake the test.
* Scenario 2:
    * Tyler, a middle school science teacher, is preparing his students for a unit on ecosystems and biodiversity. He wants to give them a quick pop quiz to assess their prior knowledge of food chains and habitats so he can see what areas his students are weak in.
    * Using "Quick Quiz", Tyler inputs the quiz topic, making the quiz out to be 15 questions long about a variety of topics about the environment. Tyler is pretty satisfied with the result, but he reviews the quiz anyway and edits a few of the question/answer pairs before administering it to his students.
* Scenario 3:
    * David, a high school senior, attends his AP United States Government class for his unit assessment.
    * Pulling out his laptop, he logs on to the "Quick Quiz" application and accesses his assessment, titled "Unit 1 Test".
    * He answers every question on the webpage from top to bottom and submits his assessment before the period ends.
    * Since tests are graded automatically, he accesses his score and sees that he answered 9 of the 10 questions correctly for a 90%! Satisfied, he closes out of the application and leaves the class.

## 3. Glossary
### Quizzes
* Quizzes are objects that hold many Questions. 
* They are created by Teachers, and are accessed by Users.
* Their results will be stored as Scores. 
### Scores
* Scores are calculated from Results.
### Questions
* Questions are objects that have many Options, but only one answer.
* Many Questions will be in a single Quiz.
### Options
* Options are answers to Questions. Only one of them is correct.
* They will have a boolean to indicate if they are the correct answer for the Question.
### Results
* Results are answers to Quizzes and Questions.
### Users
* Users can browse for and access Quizzes, view Scores associated with them, and give Responses to Questions.
### Teachers
* Teachers are Users with higher permissions. 
* They can create, edit, and delete Quizzes. They can also view and reset any Score associated with a User.
* One Teacher can create many Quizzes. 
* All Teachers are Users but not all Users are Teachers.

## 4. High Level Requirement
* Login to the application (STUDENT, TEACHER)
* Create a quiz (using AI methods) (TEACHER)
* Edit a quiz (TEACHER)
* Delete a quiz (TEACHER)
* Browse quizzes (STUDENTS, TEACHER)
* Take a quiz (STUDENTS, TEACHER)
* Save student quiz scores (automatic)
* View everyone’s quiz scores (TEACHER)
* View individual quiz score (STUDENT, TEACHER)
* Reset quiz score in case of retake (TEACHER)

If there is time available:
* Manually upload quiz JSON (TEACHER)
* Manually download quiz JSON (TEACHER)

## 5. User Stories/Scenarios
#### Current prompt draft. WILL change in the future:
Create for me a quiz in a JSON format. It must be (INPUT) questions long with (INPUT) options for each question. The quiz must be about (INPUT). Do not include an explanation before or after the JSON code. 

(Additional areas must be included so that the JSON is standardized to be inputted into the server.)

* **Create a Quiz**
    * Use the prompt above to generate a quiz with **"x"** question and **"y"** answer options based on a topic.
    * The quiz is returned in JSON format.
    * The teacher has no manual control over the creation of the quiz.

Precondition: User is a TEACHER

Post-condition: The Quiz is added to the server.

* **Edit a Quiz**
    * Once a quiz is created, the teacher can edit the question and answer choices in the quiz.

Precondition: User is a TEACHER

Post-condition: The edited Quiz is updated.

* **Delete a Quiz**
    * If a quiz is outdated or unecessary, the teacher can delete it.   

Precondition: User is a TEACHER

Post-condition: The targeted Quiz is deleted *entirely*.

* **Browse Quizzes** 
    * Text-based, table format 
    * Lists available quizzes to the user

Precondition: None

Post-condition: None

* **Take a Quiz** 
    * Text-based, table format 
    * Lists available quizzes to the user

Precondition: User must be logged in, and the user must NOT have taken the quiz already.

Post-condition: Quiz score is registered for the user.

* **Save Student Quiz Scores** 
    * Once a user submits a quiz, the score is automatically pushed to the server for TEACHERs to browse.

Precondition: none

Post-condition: Quiz score is registered for the user.

* **View Everyone's Quiz Scores** 
    * A TEACHER must be able to view all the quiz scores for each quiz in the server.

Precondition: User is a TEACHER

Post-condition: none

* **View Individual Quiz Scores** 
    * A user (STUDENT or TEACHER) must be able to view their own quiz score for a specific quiz.

Precondition: none

Post-condition: none

* **Reset quiz score in case of retake** 
    * A TEACHER must be able to delete/reset a user's quiz score for a quiz in case something unexpected occurs (retake, server error, etc.)

Precondition: User is a TEACHER

Post-condition: Quiz score for specific quiz is reset
