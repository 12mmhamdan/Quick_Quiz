package learn.quizgen.controllers;

import learn.quizgen.models.Teacher;
import learn.quizgen.domain.TeacherService;
import learn.quizgen.domain.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public ResponseEntity<?> getAllTeachers() {
        List<Teacher> teachers = teacherService.findAll();

        if (teachers.isEmpty()) {
            return new ResponseEntity<>("No teachers found.", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(teachers, HttpStatus.OK);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTeacherById(@PathVariable int id) {
        Teacher teacher = teacherService.findById(id);

        if (teacher == null) {
            return new ResponseEntity<>("Teacher not found.", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(teacher, HttpStatus.OK);
        }
    }

    @PostMapping
    public ResponseEntity<?> createTeacher(@RequestBody Teacher teacher) {
        Result<Teacher> result = teacherService.add(teacher);

        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeacher(@PathVariable int id, @RequestBody Teacher teacher) {
        teacher.setTeacherId(id);
        Result<Teacher> result = teacherService.update(teacher);

        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable int id) {
        boolean success = teacherService.deleteById(id);

        if (success) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>("Teacher not found or could not be deleted.", HttpStatus.NOT_FOUND);
        }
    }
}
