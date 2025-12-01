package learn.quizgen.data;

import learn.quizgen.models.Quiz;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class QuizRepositoryJdbcTemplateTest {

    @Autowired
    QuizRepositoryJdbcTemplate repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindQuizzes() {
        List<Quiz> quizzes = repository.findAll();
        assertNotNull(quizzes);
        assertTrue(quizzes.size() > 0);
    }

    @Test
    void shouldFindFirstQuiz() {
        Quiz quiz = repository.findById(1);
        assertEquals(3, quiz.getNumberOfQuestions());
    }

    @Test
    void shouldAddQuiz() {
        Quiz quiz = new Quiz(0, 1, "Second Quiz", "added quiz", "",  1, 1, "topic", "prompt", "");
        Quiz actual = repository.add(quiz);
        assertNotNull(actual);
    }

    @Test
    void shouldUpdateQuiz() {
        Quiz quiz = new Quiz(1, 1, "Edited Quiz", "edited quiz","",  3, 3, "topic", "prompt", "");
        assertTrue(repository.update(quiz));
    }

    @Test
    void shouldDeleteQuiz() {
        Quiz quiz = new Quiz(0, 1, "Second Quiz", "added quiz", "", 1, 1, "topic", "prompt", "");
        Quiz actual = repository.add(quiz);
        assertNotNull(actual);
        assertTrue(repository.deleteById(2));
        assertFalse(repository.deleteById(2));
    }
}