package learn.quizgen.data;

import learn.quizgen.models.Quiz;

import java.util.List;

public interface QuizRepository {
    List<Quiz> findAll();

    Quiz findById(int id);

    Quiz add(Quiz quiz);

    boolean update(Quiz quiz);

    boolean deleteById(int id);
}
