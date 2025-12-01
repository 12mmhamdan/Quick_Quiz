package learn.quizgen.data;

import learn.quizgen.models.QuizResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class QuizResultJdbcTemplateTest {

    @Autowired
    QuizResultRepositoryJdbcTemplate repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindQuizResults() {
        List<QuizResult> quizResults = repository.findAll();
        assertNotNull(quizResults);
        assertTrue(quizResults.size() > 0);
    }

    @Test
    void shouldFindFirstQuizResult() {
        QuizResult quizResult = repository.findById(1);
        assertEquals(3, quizResult.getTotalQuestions());
    }

    @Test
    void shouldAddQuizResult() {
        QuizResult quizResult = new QuizResult(0, 2, 1, 3, 3, 100, "username", "title", "topic");
        QuizResult actual = repository.add(quizResult);
        assertNotNull(actual);
    }

    @Test
    void shouldUpdateQuizResult() {
        QuizResult quizResult = new QuizResult(1, 2, 1, 3, 3, 100,"username", "title", "topic");
        assertTrue(repository.update(quizResult));
    }

    @Test
    void shouldDeleteQuizResult() {
        QuizResult quizResult = new QuizResult(0, 2, 1, 3, 3, 100,"username", "title", "topic");
        QuizResult actual = repository.add(quizResult);
        assertNotNull(actual);
        assertTrue(repository.deleteById(2));
        assertFalse(repository.deleteById(2));
    }
}