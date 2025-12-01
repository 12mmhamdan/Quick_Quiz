package learn.quizgen.domain;

import learn.quizgen.data.QuizResultRepository;
import learn.quizgen.models.QuizResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizResultService {

    private final QuizResultRepository quizResultRepository;

    public QuizResultService(QuizResultRepository quizResultRepository) {
        this.quizResultRepository = quizResultRepository;
    }

    public Result<List<QuizResult>> findAll() {
        Result<List<QuizResult>> result = new Result<>();
        List<QuizResult> quizResults = quizResultRepository.findAll();

        if (quizResults == null || quizResults.isEmpty()) {
            result.addMessage("No quiz results found.", ResultType.NOT_FOUND);
        } else {
            result.setPayload(quizResults);
        }

        return result;
    }

    public Result<QuizResult> findById(int id) {
        Result<QuizResult> result = new Result<>();
        QuizResult quizResult = quizResultRepository.findById(id);

        if (quizResult == null) {
            result.addMessage("Quiz result not found.", ResultType.NOT_FOUND);
        } else {
            result.setPayload(quizResult);
        }

        return result;
    }

    public Result<QuizResult> add(QuizResult quizResult) {
        Result<QuizResult> result = validateQuizResult(quizResult);

        if (!result.isSuccess()) {
            return result;
        }

        QuizResult createdQuizResult = quizResultRepository.add(quizResult);
        result.setPayload(createdQuizResult);
        return result;
    }

    public Result<QuizResult> update(QuizResult quizResult) {
        Result<QuizResult> result = validateQuizResult(quizResult);

        if (!result.isSuccess()) {
            return result;
        }

        boolean success = quizResultRepository.update(quizResult);
        if (!success) {
            result.addMessage("Quiz result update failed.", ResultType.ERROR);
        } else {
            result.setPayload(quizResult);
        }

        return result;
    }

    public Result<Void> deleteById(int id) {
        Result<Void> result = new Result<>();

        boolean success = quizResultRepository.deleteById(id);
        if (!success) {
            result.addMessage("Quiz result not found or could not be deleted.", ResultType.NOT_FOUND);
        }

        return result;
    }

    private Result<QuizResult> validateQuizResult(QuizResult quizResult) {
        Result<QuizResult> result = new Result<>();

        if (quizResult.getQuizId() <= 0) {
            result.addMessage("Quiz ID is required and must be positive.", ResultType.INVALID);
        }
        if (quizResult.getUserId() <= 0) {
            result.addMessage("User ID is required and must be positive.", ResultType.INVALID);
        }
        if (quizResult.getTotalQuestions() <= 0) {
            result.addMessage("Total questions must be positive.", ResultType.INVALID);
        }
        if (quizResult.getCorrectAnswers() < 0 || quizResult.getCorrectAnswers() > quizResult.getTotalQuestions()) {
            result.addMessage("Correct answers must be between 0 and the total number of questions.", ResultType.INVALID);
        }
        if (quizResult.getScore() < 0 || quizResult.getScore() > 100) {
            result.addMessage("Percent correct must be between 0 and 100.", ResultType.INVALID);
        }
        if (quizResult.getOptionList() == null || quizResult.getOptionList().isEmpty()) {
            result.addMessage("Option list cannot be null or empty.", ResultType.INVALID);
        }
        if (quizResult.getQuestionList() == null || quizResult.getQuestionList().isEmpty()) {
            result.addMessage("Question list cannot be null or empty.", ResultType.INVALID);
        }

        return result;
    }
}
