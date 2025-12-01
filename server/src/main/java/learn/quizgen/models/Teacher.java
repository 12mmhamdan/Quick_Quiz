package learn.quizgen.models;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Teacher {
    private int teacherId;
    private int userId;
    private List<Quiz> quizList = new ArrayList<>();

    public Teacher(int teacherId, int userId) {
        this.teacherId = teacherId;
        this.userId = userId;
    }

    public int getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(int teacherId) {
        this.teacherId = teacherId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public List<Quiz> getQuizList() {
        return quizList;
    }

    public void setQuizList(List<Quiz> quizList) {
        this.quizList = quizList;
    }
}