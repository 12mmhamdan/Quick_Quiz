package learn.quizgen.domain;

import learn.quizgen.data.QuizRepository;
import learn.quizgen.models.Quiz;
import org.springframework.stereotype.Service;

import javax.validation.ValidationException;
import java.util.List;

@Service
public class QuizService {
    private final QuizRepository quizRepository;

    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    public Result<Quiz> addQuiz(Quiz quiz) {
        Result<Quiz> result = new Result<>();
        try {
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
