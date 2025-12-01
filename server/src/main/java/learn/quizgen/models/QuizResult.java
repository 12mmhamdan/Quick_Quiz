package learn.quizgen.models;

import java.util.ArrayList;
import java.util.List;

public class QuizResult {
    private int quizResultId;
    private int userId;
    private int quizId;
    private int correctAnswers;
    private int totalQuestions;
    private float score;
    private List<Option> optionList = new ArrayList<>();
    private List<Question> questionList = new ArrayList<>();

    private String username;
    private String title;
    private String topic;

    public QuizResult(int quizResultId, int userId, int quizId, int correctAnswers, int totalQuestions, float percentCorrect, String username, String title, String topic) {
        this.quizResultId = quizResultId;
        this.userId = userId;
        this.quizId = quizId;
        this.correctAnswers = correctAnswers;
        this.totalQuestions = totalQuestions;
        this.score = percentCorrect;
        this.username = username;
        this.title = title;
        this.topic = topic;
    }

    public int getQuizResultId() {
        return quizResultId;
    }

    public void setQuizResultId(int quizResultId) {
        this.quizResultId = quizResultId;
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

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public float getScore() {
        return score;
    }

    public void setScore(float score) {
        this.score = score;
    }

    public List<Option> getOptionList() {
        return optionList;
    }

    public void setOptionList(List<Option> optionList) {
        this.optionList = optionList;
    }

    public List<Question> getQuestionList() {
        return questionList;
    }

    public void setQuestionList(List<Question> questionList) {
        this.questionList = questionList;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
}

