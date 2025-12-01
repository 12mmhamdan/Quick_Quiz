
## Class Diagram

```
src
├───main
│   ├───java
│   │   └───learn
│   │       └───quizgen
│   │           │   App.java
│   │           │
│   │           ├───controller
│   │           │       QuizController.java
│   │           │       QuestionController.java
│   │           │       OptionController.java
│   │           │       QuestionResultController.java
│   │           │       ScoreController.java
│   │           │       UserController.java
│   │           │       TeacherController.java
│   │           │       QuizApiException.java
│   │           │
│   │           ├───data
│   │           │       QuizRepository.java
│   │           │       QuizJdbcTemplateRepository.java
│   │           │       QuestionRepository.java
│   │           │       QuestionJdbcTemplateRepository.java
│   │           │       OptionRepository.java
│   │           │       OptionJdbcTemplateRepository.java
│   │           │       QuestionResultRepository.java
│   │           │       QuestionResultJdbcTemplateRepository.java
│   │           │       ScoreRepository.java
│   │           │       ScoreJdbcTemplateRepository.java
│   │           │       UserRepository.java
│   │           │       UserJdbcTemplateRepository.java
│   │           │       TeacherRepository.java
│   │           │       TeacherJdbcTemplateRepository.java
│   │           ├─────────mapper
│   │           │			QuizMapper.java
│   │           │			QuestionMapper.java
│   │           │			OptionMapper.java
│   │           │			ResultMapper.java
│   │           │			ScoreMapper.java
│   │           │			UserMapper.java
│   │           │			TeacherMapper.java
│   │           ├───domain
│   │           │       QuizService.java
│   │           │       QuestionService.java
│   │           │       OptionService.java
│   │           │       QuestionResultService.java
│   │           │       ScoreService.java
│   │           │       UserService.java
│   │           │       TeacherService.java
│   │           │       Result.java
│   │           │       ResultType.java
│   │           │
│   │           └───models
│   │                     Quiz.java
│   │                     Question.java
│   │                     Option.java
│   │                     QuestionResult.java
│   │                     Score.java
│   │                     User.java
│   │                     Teacher.java
│   │
│   └───resources
│           application.properties
│
└───test
    └───java
        └───learn
            └───quizgen
                ├───controllers
                │       QuizControllerTest.java
                │       QuestionControllerTest.java
                │       OptionControllerTest.java
                │       ResultControllerTest.java
                │       ScoreControllerTest.java
                │       UserControllerTest.java
                │       TeacherControllerTest.java
                ├───data
                │       QuizJdbcRepositoryTest.java
                │       QuestionJdbcRepositoryTest.java
                │       OptionJdbcRepositoryTest.java
                │       ResultJdbcRepositoryTest.java
                │       ScoreJdbcRepositoryTest.java
                │       UserJdbcRepositoryTest.java
                │       TeacherJdbcRepositoryTest.java
                │       KnownGoodState.java
                └───domain
                        QuizServiceTest.java
                        QuestionServiceTest.java
                        OptionServiceTest.java
                        ResultServiceTest.java
                        ScoreServiceTest.java
                        UserServiceTest.java
                        TeacherServiceTest.java
```


## List of all classes and methods
### Source
#### controller
* NOTE: Needs to implement @RestController, @CrossOrigin, @RequestMapping
* QuizController.java
	* findAll
	* findById
	* add
	* update
	* deleteById
* QuestionController.java
	* findAll
	* findById
	* add
	* update
	* deleteById
* OptionController.java
	* findAll
	* findById
	* add
	* update
	* deleteById
* QuestionResultController.java
	* findAll
	* findById
	* add
	* update
	* deleteById
* ScoreController.java
	* findAll
	* findById
	* add
	* update
	* deleteById
* UserController.java
	* findAll
	* findById
	* add
	* update
	* deleteById
* TeacherController.java
	* findAll
	* findById
	* add
	* update
	* deleteById
* QuizApiException.java
	* handleException

#### data
* QuizRepository.java
	* **Template**
	* findAll
	* findById
	* add
	* update
	* deleteById
* QuizJdbcTemplateRepository.java
	* **Implement template**
	* update
		* update per question using SQL
* QuestionRepository.java
	* **Template**
	* findAll
	* findById
	* add
	* update
	* deleteById
* QuestionJdbcTemplateRepository.java
	* **Implement template**
* OptionRepository.java
	* **Template**
	* findAll
	* findById
	* add
	* update
	* deleteById
* OptionJdbcTemplateRepository.java
	* **Implement template**
* QuestionResultRepository.java
	* **Template**
	* findAll
	* findById
	* add
	* update
	* deleteById
* QuestionResultJdbcTemplateRepository.java
	* **Implement template**
* ScoreRepository.java
	* **Template**
	* findAll
	* findById
	* add
	* update
	* deleteById
* ScoreJdbcTemplateRepository.java
	* **Implement template**
* UserRepository.java
	* **Template**
	* findAll
	* findById
	* add
	* update
	* deleteById
* UserJdbcTemplateRepository.java
	* **Implement template**
* TeacherRepository.java
	* **Template**
	* findAll
	* findById
	* add
	* update
	* deleteById
* TeacherJdbcTemplateRepository.java
	* **Implement template**

#### mapper
* QuizMapper.java
    * mapRow
* QuestionMapper.java
    * mapRow
* OptionMapper.java
    * mapRow
* ResultMapper.java
    * mapRow
* ScoreMapper.java
    * mapRow
* UserMapper.java
    * mapRow
* TeacherMapper.java
    * mapRow


#### domain
* QuizService.java
	* findAll
	* findById
	* add
	* update
	* deleteById
	* validate
* QuestionService.java
	* findAll
	* findById
	* add
	* update
	* deleteById
	* validate
* OptionService.java
	* findAll
	* findById
	* add
	* update
	* deleteById
	* validate
* QuestionResultService.java
	* findAll
	* findById
	* add
	* update
	* deleteById
	* validate
* ScoreService.java
	* findAll
	* findById
	* add
	* update
	* deleteById
	* validate
* UserService.java
	* findAll
	* findById
	* add
	* update
	* deleteById
	* validate
* TeacherService.java
	* findAll
	* findById
	* add
	* update
	* deleteById
	* validate
* Result.java
	* getType
	* isSuccess
	* getPayload
	* setPayload
	* getMessages
	* addMessage
* ResultType.java
	* Enum

#### models
* Quiz.java
    * getQuizId
    * setQuizId
    * getTeacherId
    * setTeacherId
    * getTitle
    * setTitle
    * getDescription
    * setDescription
* Question.java
    * getQuestionId
    * setQuestionId
    * getQuizId
    * setQuizId
    * getQuestionText
    * setQuestionText
* Option.java
    * getOptionId
    * setOptionId
    * getQuestionId
    * setQuestionId
    * getOptionText
    * setOptionText
    * isCorrect
    * setIsCorrect
* QuestionResult.java
    * getResultId
    * setResultId
    * getUserId
    * setUserId
    * getQuizId
    * setQuizId
    * getQuestionId
    * setQuestionId
    * getOptionId
    * setOptionId
* Score.java
    * getScoreId
    * setScoreId
    * getUserId
    * setUserId
    * getQuizId
    * setQuizId
    * getScore
    * setScore
* User.java
    * getUserId
    * setUserId
    * getFirstName
    * setFirstName
    * getLastName
    * setLastName
    * getUsername
    * setUsername
    * getPassword
    * setPassword
* Teacher.java
    * getTeacherId
    * setTeacherId
    * getUserId
    * setUserId

#### resources
* application.properties
	* ${DB_USERNAME}
	* ${DB_PASSWORD}


## High Level Requirements

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

## Part 1: Server + SQL
### Data
* [ ] Create SQL schema based off of Database Schema
    * [ ] Test SQL schema using HTTP methods   
    * [ ] Create corresponding Models in /src/main/java/[PROJECT_NAME]/models
        * [ ] Create User Model
            * [ ] Create Corresponding Mapper
            * [ ] Create Corresponding Repository
                * [ ] CRUD Operations  
        * [ ] Create Teacher Model
            * [ ] Create Corresponding Mapper
            * [ ] Create Corresponding Repository
                * [ ] CRUD Operations  
        * [ ] Create Quiz Model
            * [ ] Create Corresponding Mapper
            * [ ] Create Corresponding Repository
                * [ ] CRUD Operations  
        * [ ] Create Question Model
            * [ ] Create Corresponding Mapper
            * [ ] Create Corresponding Repository
                * [ ] CRUD Operations  
        * [ ] Create Result Model
            * [ ] Create Corresponding Mapper
            * [ ] Create Corresponding Repository
                * [ ] CRUD Operations  
        * [ ] Create Score Model
            * [ ] Create Corresponding Mapper
            * [ ] Create Corresponding Repository
                * [ ] CRUD Operations
* [ ] Test created Repositories

### Domain
* [ ] Create Services and corresponding methods for each Model/Repository
    * [ ] Create User Service
        * [ ] Generate authorization key
        * [ ] Validate username and password
    * [ ] Create Teacher Service
        * [ ] Be able to create, edit, delete Quizzes
        * [ ] View scores by quiz
    * [ ] Create Quiz Service
        * [ ] Quizzes need to have the user logged in to be taken.
        * [ ] Validate teacher_id, title and description
    * [ ] Create Question Service
        * [ ] Validate quiz_id and question_text
    * [ ] Create Result Service
        * [ ] Validate user_id, quiz_id, question_id, option_id.
    * [ ] Create Score Service
        * [ ] Validate user_id, quiz_id, score
        * [ ] Calculate score based on results from user_id
* [ ] Test created Services

### Controllers
* [ ] Create Controllers and corresponding methods for each Service
    * [ ] Create User Controller
    * [ ] Create Teacher Controller
    * [ ] Create Quiz Controller
    * [ ] Create Question Controller
    * [ ] Create Result Controller
    * [ ] Create Score Controller

* [ ] Test created Controllers
    * [ ] GET
    * [ ] POST
    * [ ] PUT
    * [ ] DELETE

## Part 1.1: Implement AI model API
* (Currently undefined, will research over the weekend.)
* (Corresponds with a Quiz, most likely in the Data layer.)
* (Creates Questions, Objects from JSON)

* Quiz Parameters:
    * Multiple Choice
    * 2 < x < 10 answer options (will adjust after discussion)
    * 1 < y < 50 questions (will adjust after discussion)
    * Must validate returned JSON object so that it returns a usable JSON object:
    * Current version of the prompt:    
        * "Create for me a quiz in a JSON format.
        * The quiz must be multiple-choice.
        * It must be (NUMBER INPUT) questions long with (NUMBER INPUT) options for each question.
        * The quiz must be about (TEXT INPUT - "Topic").
        * The format must contain a "quiz" object with two nested objects, "title" and "questions".
        * "title" is a string value on the topic of the quiz.
        * "questions" is an array containing individual questions.
        * Each question in the "questions" array is made up of three parts:
        * "question", a string containing the question itself
        * "options", an array containing answers as a string
        * "correct_answer", string representing the correct answer
        * Do not include an explanation before or after the JSON code." 


## Part 2: Client
### React
* [ ] Create new React project with create-react-app
    * [ ] Remove unnecessary files

* [ ] Add Bootstrap
   * [ ] Add a link to the Bootstrap CSS using the 
[CDN from the official docs](https://getbootstrap.com/docs/4.6/getting-started/introduction/#css)
  * [ ] Add the [`container` CSS class](https://getbootstrap.com/docs/4.6/layout/overview/#containers) to the `<div id="root"></div>` element

* [ ] Components and Routing
 	[ ] Create Quizzes component
* Update the APP component to render the QUIZZES component
*Set up basic routing between components (login, dashboard, quizzes, etc.)
[ ] Update Quizzes to render a list of available quizzes
	*Use FETCH to GET a list of quizzes from the Quiz API when the component is first loaded
	*Write JSX to render the quizzes array
	*Use event handlers for "Take Quiz", "Edit Quiz", and "Delete Quiz" 

* [ ] Student Flow
	* [ ] Login Page 
	  * Create a login form with username and password fields
	  * Add onSubmit event handler to authenticate the user
	  * Redirect user to appropriate dashboard after login
	* [ ] Student Dashboard
		* Display the available quizzes for students
		* Add a button to “Take Quiz”
		* Use FETCH to GET the list of quizzes the student can take from the Quiz API
	* [ ] Take Quiz Form
		* Display quiz questions and multiple-choice options fetched from the API
		* Add ONSUBMIT event handler to submit quiz answers
		* Display confirmation after successful submission of the quiz and calculation of the score
	* [ ] View Scores 
		* Display the student’s quiz scores fetched from API

* [ ] Teacher Flow
    * Teacher Dashboard	
	* Add buttons for creating a new quiz, viewing/editing/deleting, and viewing/resetting    scores
	* Use FETCH to GET a list of all quizzes created by the teacher from the Quiz API
* [ ] Create a Form to Add a Quiz
	* Add form fields for number of questions, number of options, and quiz topic
	* Add onChange event handlers to input elements
	* Add onSubmit handler to form to request quiz from API
	* After successful quiz creation, update quizzes array or display errors
*   [ ] Support Deleting Quizzes
	* Confirm deletion
	* Use FETCH to DELETE quiz from backend DB
	* update the quizzes array in the state (don’t modify original)( if successful)
* [ ] Edit Quiz Form
	* Add form to edit quiz questions and options
	* Fetch quiz data using GET when component is first loaded
	* Add onSubmit event handler to submit changes via PUT
	* On success, redirect to the Teacher Dashboard or show errors
* [ ] View and Edit Score
	* Display all student’s scores for a select quiz
	* Add a button to edit scores (maybe)
### Different Views
* [ ] Login Page (STUDENT/TEACHER):
    * Title: Quick Quiz Login
    * Username Input Field
    * Password Input Field
    * Login Button
    * Sign Up Link (optional)
 * [ ] Teacher Dashboard (After login as TEACHER):
* Title: Teacher Dashboard
    * Options:
    * Create New Quiz Button
    * View/Edit/Delete Quizzes Button
    * View All Scores Button
    * Reset Scores Button
* [ ] Student Dashboard (After login as STUDENT):
    * Title: Student Dashboard
    * Options:
    * Take Quiz Button (Shows Available Quizzes)
* [ ] Create Quiz Page (For TEACHER):
    * Title: Create a New Quiz
    * Fields:
    * Input for Number of Questions (Number field)
    * Input for Number of Options per Question (Number field)
    * Input for Quiz Topic (Text field)
    * Generate Quiz Button (Sends inputs to AI for generating the quiz)
* [ ] Edit Quiz Page (For TEACHER):
    * Title: Edit Quiz
    * Display Existing Quiz in Table Format:
    * Editable Questions & Options Fields (Allow text input/edit)
    * Save Changes Button
    * Delete Quiz Button
* [ ] View Quiz Page (For STUDENT):
    * Title: Take Quiz
    * Quiz Display:
    * Questions Listed (in table or card format)
    * Multiple Choice Answer Options (Radio buttons)
    * Submit Quiz Button
* [ ] View Scores Page (For STUDENT/TEACHER):
    * Title: Quiz Scores
    * Display:
    * Quiz List for Teacher to View All Scores
    * Student can see their own scores
* [ ] Reset Scores Page (For TEACHER):
    * Title: Reset Scores
    * Display:
    * List of Students and their Quiz Scores
    * Reset Button next to each student’s score
