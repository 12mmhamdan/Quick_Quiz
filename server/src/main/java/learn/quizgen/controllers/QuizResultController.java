package learn.quizgen.controllers;

import learn.quizgen.models.QuizResult;
import learn.quizgen.domain.QuizResultService;
import learn.quizgen.domain.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-results")
public class QuizResultController {

    private final QuizResultService quizResultService;

    public QuizResultController(QuizResultService quizResultService) {
        this.quizResultService = quizResultService;
    }

    @GetMapping
    public ResponseEntity<?> getAllQuizResults() {
        Result<List<QuizResult>> result = quizResultService.findAll();

        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizResultById(@PathVariable int id) {
        Result<QuizResult> result = quizResultService.findById(id);

        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createQuizResult(@RequestBody QuizResult quizResult) {
        Result<QuizResult> result = quizResultService.add(quizResult);

        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuizResult(@PathVariable int id, @RequestBody QuizResult quizResult) {
        quizResult.setQuizResultId(id);
        Result<QuizResult> result = quizResultService.update(quizResult);

        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuizResult(@PathVariable int id) {
        Result<Void> result = quizResultService.deleteById(id);

        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.NOT_FOUND);
        }
    }
}
