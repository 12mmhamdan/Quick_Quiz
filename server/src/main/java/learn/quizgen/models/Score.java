package learn.quizgen.models;

import java.util.Objects;

public class Score {
    private int scoreId;
    private int userId;
    private int quizId;
    private double score;

    public Score(int scoreId, int userId, int quizId, double score) {
        this.scoreId = scoreId;
        this.userId = userId;
        this.quizId = quizId;
        this.score = score;
    }

    public int getScoreId() {
        return scoreId;
    }

    public void setScoreId(int scoreId) {
        this.scoreId = scoreId;
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

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}