package learn.quizgen.data;

import learn.quizgen.data.mapper.OptionMapper;
import learn.quizgen.models.Option;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class OptionRepositoryJdbcTemplate implements OptionRepository {

    private final JdbcTemplate jdbcTemplate;

    public OptionRepositoryJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Option> findAll() {
        final String sql = "SELECT * FROM `option`";
        return jdbcTemplate.query(sql, new OptionMapper());
    }

    @Override
    public Option findById(int id) {
        final String sql = "SELECT * FROM `option` WHERE option_id = ?";
        return jdbcTemplate.queryForObject(sql, new OptionMapper(), id);
    }

    @Override
    public Option add(Option option) {
        final String sql = "INSERT INTO `option` (question_id, option_text, is_correct) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, option.getQuestionId());
            ps.setString(2, option.getOptionText());
            ps.setBoolean(3, option.isCorrect());
            return ps;
        }, keyHolder);
        option.setOptionId(keyHolder.getKey().intValue());
        return option;
    }

    @Override
    public boolean update(Option option) {
        final String sql = "UPDATE `option` SET question_id = ?, option_text = ?, is_correct = ? WHERE option_id = ?";
        return jdbcTemplate.update(sql,
                option.getQuestionId(),
                option.getOptionText(),
                option.isCorrect(),
                option.getOptionId()) > 0;
    }

    @Override
    public boolean deleteById(int id) {
        final String sql = "DELETE FROM `option` WHERE option_id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
