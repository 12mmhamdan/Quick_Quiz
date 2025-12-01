package learn.quizgen.data;

import learn.quizgen.models.QuestionResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class QuestionResultRepositoryJdbcTemplateTest {

    @Autowired
    QuestionResultRepositoryJdbcTemplate repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindQuestionResults() {
        List<QuestionResult> questionResults = repository.findAll();
        assertNotNull(questionResults);
        assertTrue(questionResults.size() > 0);
    }

    @Test
    void shouldFindQuestionResult3() {
        QuestionResult questionResult = repository.findById(3);
        assertEquals(3, questionResult.getQuestionId());
    }

    @Test
    void shouldAddQuestionResult() {
        QuestionResult questionResult = new QuestionResult(0, 1, 1, 3, 8);
        QuestionResult actual = repository.add(questionResult);
        assertNotNull(actual);
    }

    @Test
    void shouldUpdateQuestion() {
        QuestionResult questionResult = new QuestionResult(2, 1, 1, 2, 4);
        assertTrue(repository.update(questionResult));
    }

    @Test
    void shouldDeleteQuestion() {
        QuestionResult questionResult = new QuestionResult(0, 1, 1, 3, 8);
        QuestionResult actual = repository.add(questionResult);
        assertNotNull(actual);
        assertTrue(repository.deleteById(4));
        assertFalse(repository.deleteById(4));
    }
}