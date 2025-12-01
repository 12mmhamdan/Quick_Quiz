package learn.quizgen.domain;

import learn.quizgen.data.QuestionRepository;
import learn.quizgen.models.Question;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Result<Question> addQuestion(Question question) {
        Result<Question> result = validate(question);
        if (!result.isSuccess()) {
            return result;
        }

        question = questionRepository.add(question);
        result.setPayload(question);
        return result;
    }

    public Result<Question> updateQuestion(Question question) {
        Result<Question> result = validate(question);
        if (!result.isSuccess()) {
            return result;
        }

        if (!questionRepository.update(question)) {
            result.addMessage("Question not found", ResultType.NOT_FOUND);
        }

        return result;
    }

    private Result<Question> validate(Question question) {
        Result<Question> result = new Result<>();
        if (question == null) {
            result.addMessage("Question cannot be null", ResultType.INVALID);
            return result;
        }

        //maybe more validations if we think of any

        return result;
    }

    public List<Question> getQuestionById(int id) {
        return questionRepository.findByQuizId(id);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public boolean deleteQuestionById(int id) {
        return questionRepository.deleteById(id);
    }
}
