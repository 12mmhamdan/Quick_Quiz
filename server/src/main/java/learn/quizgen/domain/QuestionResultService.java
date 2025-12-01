package learn.quizgen.domain;

import learn.quizgen.data.QuestionResultRepository;
import learn.quizgen.domain.Result;
import learn.quizgen.domain.ResultType;
import learn.quizgen.models.QuestionResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionResultService {

    private final QuestionResultRepository questionResultRepository;

    public QuestionResultService(QuestionResultRepository questionResultRepository) {
        this.questionResultRepository = questionResultRepository;
    }

    public Result<List<QuestionResult>> findAll() {
        Result<List<QuestionResult>> result = new Result<>();
        List<QuestionResult> questionResults = questionResultRepository.findAll();

        if (questionResults == null || questionResults.isEmpty()) {
            result.addMessage("No question results found.", ResultType.NOT_FOUND);
        } else {
            result.setPayload(questionResults);
        }

        return result;
    }

    public Result<QuestionResult> findById(int id) {
        Result<QuestionResult> result = new Result<>();
        QuestionResult questionResult = questionResultRepository.findById(id);

        if (questionResult == null) {
            result.addMessage("Question result not found.", ResultType.NOT_FOUND);
        } else {
            result.setPayload(questionResult);
        }

        return result;
    }

    public Result<QuestionResult> add(QuestionResult questionResult) {
        Result<QuestionResult> result = validateQuestionResult(questionResult);

        if (!result.isSuccess()) {
            return result;
        }

        QuestionResult createdQuestionResult = questionResultRepository.add(questionResult);
        result.setPayload(createdQuestionResult);
        return result;
    }

    public Result<QuestionResult> update(QuestionResult questionResult) {
        Result<QuestionResult> result = validateQuestionResult(questionResult);

        if (!result.isSuccess()) {
            return result;
        }

        boolean success = questionResultRepository.update(questionResult);
        if (!success) {
            result.addMessage("Question result update failed.", ResultType.ERROR);
        } else {
            result.setPayload(questionResult);
        }

        return result;
    }

    public Result<Void> deleteById(int id) {
        Result<Void> result = new Result<>();

        boolean success = questionResultRepository.deleteById(id);
        if (!success) {
            result.addMessage("Question result not found or could not be deleted.", ResultType.NOT_FOUND);
        } else {
            result.addMessage("Question result successfully deleted.", ResultType.SUCCESS);
        }

        return result;
    }

    private Result<QuestionResult> validateQuestionResult(QuestionResult questionResult) {
        Result<QuestionResult> result = new Result<>();

        if (questionResult.getQuestionId() <= 0) {
            result.addMessage("Question ID is required and must be positive.", ResultType.INVALID);
        }
        if (questionResult.getOptionId() <= 0) {
            result.addMessage("Option ID is required and must be positive.", ResultType.INVALID);
        }
        if (questionResult.getUserId() <= 0) {
            result.addMessage("User ID is required and must be positive.", ResultType.INVALID);
        }
        if (questionResult.getQuizId() <= 0) {
            result.addMessage("Quiz ID is required and must be positive.", ResultType.INVALID);
        }

        return result;
    }
}
