package learn.quizgen.data;

import learn.quizgen.models.QuestionResult;

import java.util.List;

public interface QuestionResultRepository {
    List<QuestionResult> findAll();

    QuestionResult findById(int id);

    QuestionResult add(QuestionResult questionResult);

    boolean update(QuestionResult questionResult);

    boolean deleteById(int id);
}
