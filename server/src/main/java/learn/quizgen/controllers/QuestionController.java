package learn.quizgen.controllers;

import learn.quizgen.data.QuestionRepository;
import learn.quizgen.domain.QuestionService;
import learn.quizgen.domain.Result;
import learn.quizgen.models.Question;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // GET all questions
    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    // GET a single question by ID
    @GetMapping("/{id}")
    public List<Question> getQuestionById(@PathVariable int id) {
        return questionService.getQuestionById(id);
    }

    // POST to create a new question
    @PostMapping
    public ResponseEntity<Object> createQuestion(@RequestBody Question question) {
        Result<Question> result = questionService.addQuestion(question);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    // PUT to update an existing question
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateQuestion(@PathVariable int id, @RequestBody Question updatedQuestion) {
        if (id != updatedQuestion.getQuestionId()){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Result<Question> result = questionService.updateQuestion(updatedQuestion);
        if (result.isSuccess()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return ErrorResponse.build(result);
    }

    // DELETE a question
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable int id) {
        if (questionService.deleteQuestionById(id)){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
