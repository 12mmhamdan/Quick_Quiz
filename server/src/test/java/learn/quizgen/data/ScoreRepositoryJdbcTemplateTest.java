package learn.quizgen.data;

import learn.quizgen.models.Score;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ScoreRepositoryJdbcTemplateTest {

    @Autowired
    ScoreRepositoryJdbcTemplate repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindScores() {
        List<Score> scores = repository.findAll();
        assertNotNull(scores);
        assertTrue(scores.size() > 0);
    }

    @Test
    void shouldFindFirstScore() {
        Score score = repository.findById(1);
        assertEquals(1, score.getQuizId());
    }

    @Test
    void shouldAddScore() {
        Score score = new Score(0, 1, 1, 100);
        Score actual = repository.add(score);
        assertNotNull(actual);
    }

    @Test
    void shouldUpdateScore() {
        Score score = new Score(1, 1, 1, 100);
        assertTrue(repository.update(score));
    }

    @Test
    void shouldDeleteScore() {
        Score score = new Score(0, 1, 1, 100);
        Score actual = repository.add(score);
        assertNotNull(actual);
        assertTrue(repository.deleteById(2));
        assertFalse(repository.deleteById(2));
    }
}