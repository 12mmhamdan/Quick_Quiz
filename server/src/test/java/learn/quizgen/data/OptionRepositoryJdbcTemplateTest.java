package learn.quizgen.data;

import learn.quizgen.models.Option;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OptionRepositoryJdbcTemplateTest {

    @Autowired
    OptionRepositoryJdbcTemplate repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup(){
        knownGoodState.set();
    }

    @Test
    void shouldFindOptions() {
        List<Option> options = repository.findAll();
        assertNotNull(options);
        assertTrue(options.size() > 0);
    }

    @Test
    void shouldFindOption1() {
        Option option = repository.findById(1);
        assertEquals("Option 1 for Question 1", option.getOptionText());
    }

    @Test
    void shouldAddOption() {
        Option option = new Option(0, 3, "added option", false);
        Option actual = repository.add(option);
        assertNotNull(actual);
    }

    @Test
    void update() {
        Option option = new Option(9, 3, "edited option", true);
        assertTrue(repository.update(option));
    }

    @Test
    void deleteById() {
        assertTrue(repository.deleteById(5));
        assertFalse(repository.deleteById(5));
    }
}