package learn.quizgen.models;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Question {
    private int questionId;
    private int quizId;
    private String questionText;
    private List<Option> optionList = new ArrayList<>();

    public Question(int questionId, int quizId, String questionText) {
        this.questionId = questionId;
        this.quizId = quizId;
        this.questionText = questionText;
    }

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public int getQuizId() {
        return quizId;
    }

    public void setQuizId(int quizId) {
        this.quizId = quizId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<Option> getOptionList() {
        return optionList;
    }

    public void setOptionList(List<Option> optionList) {
        this.optionList = optionList;
    }
}