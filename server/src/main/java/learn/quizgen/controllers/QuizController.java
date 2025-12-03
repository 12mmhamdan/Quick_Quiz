package learn.quizgen.controllers;

import learn.quizgen.domain.QuizService;
import learn.quizgen.domain.Result;
import learn.quizgen.domain.TeacherService;
import learn.quizgen.models.AppUser;
import learn.quizgen.models.Quiz;
import learn.quizgen.models.Teacher;
import learn.quizgen.security.AppUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;
    private final AppUserService appUserService;   // 🔹 NEW
    private final TeacherService teacherService;   // 🔹 NEW

    public QuizController(QuizService quizService,
                          AppUserService appUserService,
                          TeacherService teacherService) {
        this.quizService = quizService;
        this.appUserService = appUserService;
        this.teacherService = teacherService;
    }

    @PostMapping
    @PreAuthorize("hasRole('Teacher')")
    public ResponseEntity<?> createQuiz(@RequestBody Quiz quiz, java.security.Principal principal) {

        // 1) Get username from JWT
        String username = principal.getName();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);

        // 2) Find teacher for this user
        Teacher teacher = teacherService.findByUserId(appUser.getAppUserId());
        if (teacher == null) {
            return new ResponseEntity<>("No teacher profile found for current user.", HttpStatus.FORBIDDEN);
        }

        // 3) Force quiz.teacherId to the logged-in teacher
        quiz.setTeacherId(teacher.getTeacherId());

        // 4) Proceed with create
        Result<Quiz> result = quizService.addQuiz(quiz);

        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizById(@PathVariable int id) {
        Result<Quiz> result = quizService.getQuizById(id);

        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllQuizzes() {
        List<Quiz> quizzes = quizService.getAllQuizzes();

        if (quizzes.isEmpty()) {
            return new ResponseEntity<>("No quizzes found.", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(quizzes, HttpStatus.OK);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Teacher')")
    public ResponseEntity<?> updateQuiz(@PathVariable int id, @RequestBody Quiz quiz) {
        quiz.setQuizId(id);
        Result<Quiz> result = quizService.updateQuiz(quiz);

        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result.getMessages(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Teacher')")
    public ResponseEntity<?> deleteQuiz(@PathVariable int id) {
        boolean success = quizService.deleteQuizById(id);

        if (success) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>("Quiz not found or could not be deleted.", HttpStatus.NOT_FOUND);
        }
    }
}
