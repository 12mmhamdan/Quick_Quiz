package learn.quizgen.data;

import learn.quizgen.models.Question;

import java.util.List;

public interface QuestionRepository {
    List<Question> findAll();

    List<Question> findByQuizId(int id);

    Question add(Question question);

    boolean update(Question question);

    boolean deleteById(int id);
}
