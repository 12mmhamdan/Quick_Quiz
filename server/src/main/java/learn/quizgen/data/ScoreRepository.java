package learn.quizgen.data;

import learn.quizgen.models.Score;

import java.util.List;

public interface ScoreRepository {
    List<Score> findAll();

    Score findById(int id);

    Score add(Score score);

    boolean update(Score score);

    boolean deleteById(int id);
}
