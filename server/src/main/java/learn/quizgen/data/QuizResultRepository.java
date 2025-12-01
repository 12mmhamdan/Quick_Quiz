package learn.quizgen.data;

import learn.quizgen.models.QuizResult;

import java.util.List;

public interface QuizResultRepository {
    List<QuizResult> findAll();

    QuizResult findById(int id);

    QuizResult add(QuizResult quiz);

    boolean update(QuizResult quiz);

    boolean deleteById(int id);
}
