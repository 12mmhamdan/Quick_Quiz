package learn.quizgen.data;

import learn.quizgen.models.Question;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class QuestionRepositoryJdbcTemplateTest {

    @Autowired
    QuestionRepositoryJdbcTemplate repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindQuestions() {
        List<Question> questions = repository.findAll();
        assertNotNull(questions);
        assertTrue(questions.size() > 0);
    }

    @Test
    void shouldFindQuestion1() {
        List<Question> question = repository.findByQuizId(1);
        assertEquals("First Question", question.get(0).getQuestionText());
    }

    @Test
    void shouldAddQuestion() {
        Question question = new Question(0, 1, "Added Question");
        Question actual = repository.add(question);
        assertNotNull(actual);
    }

    @Test
    void shouldUpdateQuestion() {
        Question question = new Question(3, 1, "Edited Question");
        assertTrue(repository.update(question));
    }

    @Test
    void shouldDeleteQuestion() {
        Question question = new Question(0, 1, "Added Question");
        Question actual = repository.add(question);
        assertNotNull(actual);
        assertTrue(repository.deleteById(4));
        assertFalse(repository.deleteById(4));
    }
}