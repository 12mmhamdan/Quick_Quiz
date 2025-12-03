package learn.quizgen.domain;

import learn.quizgen.data.AppUserRepository;
import learn.quizgen.data.QuizRepository;
import learn.quizgen.models.AppUser;
import learn.quizgen.data.TeacherRepository;
import learn.quizgen.models.Quiz;
import learn.quizgen.models.Teacher;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.validation.ValidationException;
import java.util.List;

@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final TeacherRepository teacherRepository;
    private final AppUserRepository appUserRepository;

    public QuizService(
            QuizRepository quizRepository,
            TeacherRepository teacherRepository,
            AppUserRepository appUserRepository
    ) {
        this.quizRepository = quizRepository;
        this.teacherRepository = teacherRepository;
        this.appUserRepository = appUserRepository;
    }
    public Result<Quiz> addQuiz(Quiz quiz) {
        Result<Quiz> result = new Result<>();

        try {
            // 🔹 1. Get authenticated username from Spring Security
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()
                    || "anonymousUser".equals(auth.getPrincipal())) {
                throw new ValidationException("You must be logged in to create a quiz.");
            }

            String username = auth.getName();

            // 🔹 2. Find AppUser by username
            AppUser appUser = appUserRepository.findByUsername(username)
                    .orElseThrow(() -> new ValidationException("User not found."));

            // 🔹 3. Find or create Teacher linked to this user
            Teacher teacher = teacherRepository.findByUserId(appUser.getAppUserId());
            if (teacher == null) {
                teacher = new Teacher(0, appUser.getAppUserId());
                teacher = teacherRepository.add(teacher);
            }

            // 🔹 4. Attach teacher_id to quiz before saving
            quiz.setTeacherId(teacher.getTeacherId());

            // 🔹 5. Validate quiz & save
            validateQuiz(quiz);
            quiz = quizRepository.add(quiz);
            result.setPayload(quiz);

        } catch (ValidationException e) {
            result.addMessage(e.getMessage(), ResultType.INVALID);
        }

        return result;
    }

    public Result<Quiz> getQuizById(int id) {
        Quiz quiz = quizRepository.findById(id);
        Result<Quiz> result = new Result<>();
        if (quiz == null) {
            result.addMessage("Quiz not found", ResultType.NOT_FOUND);
        } else {
            result.setPayload(quiz);
        }
        return result;
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Result<Quiz> updateQuiz(Quiz quiz) {
        Result<Quiz> result = new Result<>();
        try {
            validateQuiz(quiz);
            if (!quizRepository.update(quiz)) {
                result.addMessage("Quiz not found", ResultType.NOT_FOUND);
            } else {
                result.setPayload(quiz);
            }
        } catch (ValidationException e) {
            result.addMessage(e.getMessage(), ResultType.INVALID);
        }
        return result;
    }

    public boolean deleteQuizById(int id) {
        return quizRepository.deleteById(id);
    }

    private void validateQuiz(Quiz quiz) {
        if (quiz.getTitle() == null || quiz.getTitle().isEmpty()) {
            throw new ValidationException("Quiz title cannot be null or empty.");
        }
        if (quiz.getDescription() == null || quiz.getDescription().isEmpty()) {
            throw new ValidationException("Quiz description cannot be null or empty.");
        }
        if (quiz.getQuizJSON() == null || quiz.getQuizJSON().isEmpty()) {
            throw new ValidationException("Quiz JSON content cannot be null or empty.");
        }
    }
}