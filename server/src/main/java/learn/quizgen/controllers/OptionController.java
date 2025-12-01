package learn.quizgen.controllers;

import learn.quizgen.domain.OptionService;
import learn.quizgen.domain.Result;
import learn.quizgen.models.Option;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/options")
public class OptionController {

    private final OptionService optionService;

    public OptionController(OptionService optionService) {
        this.optionService = optionService;
    }

    // GET all options
    @GetMapping
    public List<Option> getAllOptions() {
        return optionService.findAll();
    }

    // GET a single option by ID
    @GetMapping("/{id}")
    public Option getOptionById(@PathVariable int id) {
        return optionService.findById(id);
    }

    // POST to create a new option
    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Option option) {
        Result<Option> result = optionService.add(option);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    // PUT to update an existing option
    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody Option updatedOption) {
        if(id != updatedOption.getOptionId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Result<Option> result = optionService.update(updatedOption);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return ErrorResponse.build(result);
    }

    // DELETE an option
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable int id) {
        boolean success = optionService.deleteById(id);
        if (success) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
