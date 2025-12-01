package learn.quizgen.controllers;

import learn.quizgen.data.QuestionResultRepository;
import learn.quizgen.domain.QuestionResultService;
import learn.quizgen.domain.Result;
import learn.quizgen.models.QuestionResult;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question-results")
public class QuestionResultController {

    private final QuestionResultService questionResultService;

    public QuestionResultController(QuestionResultService questionResultService) {
        this.questionResultService = questionResultService;
    }

    // GET all question results
    @GetMapping
    public List<QuestionResult> getAllQuestionResults() {
        return questionResultService.findAll().getPayload();
    }

    // GET a single question result by ID
    @GetMapping("/{id}")
    public QuestionResult getQuestionResultById(@PathVariable int id) {
        return questionResultService.findById(id).getPayload();
    }

    // POST to create a new question result
    @PostMapping
    public ResponseEntity<Object> createQuestionResult(@RequestBody QuestionResult questionResult) {
        Result<QuestionResult> result = questionResultService.add(questionResult);
        if (result.isSuccess()){
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    // PUT to update an existing question result
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateQuestionResult(@PathVariable int id, @RequestBody QuestionResult updatedQuestionResult) {
        if (id != updatedQuestionResult.getResultId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Result<QuestionResult> result = questionResultService.update(updatedQuestionResult);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return ErrorResponse.build(result);
    }

    // DELETE a question result
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestionResult(@PathVariable int id) {
        if (questionResultService.deleteById(id).isSuccess()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
