package learn.quizgen.models;

import java.util.Objects;

public class QuestionResult {
    private int resultId;
    private int userId;
    private int quizId;
    private int questionId;
    private int optionId;

    public QuestionResult(int resultId, int userId, int quizId, int questionId, int optionId) {
        this.resultId = resultId;
        this.userId = userId;
        this.quizId = quizId;
        this.questionId = questionId;
        this.optionId = optionId;
    }

    public int getResultId() {
        return resultId;
    }

    public void setResultId(int resultId) {
        this.resultId = resultId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getQuizId() {
        return quizId;
    }

    public void setQuizId(int quizId) {
        this.quizId = quizId;
    }

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public int getOptionId() {
        return optionId;
    }

    public void setOptionId(int optionId) {
        this.optionId = optionId;
    }
}