package learn.quizgen.data;

import learn.quizgen.data.mapper.QuestionResultMapper;
import learn.quizgen.models.QuestionResult;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class QuestionResultRepositoryJdbcTemplate implements QuestionResultRepository {

    private final JdbcTemplate jdbcTemplate;

    public QuestionResultRepositoryJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<QuestionResult> findAll() {
        final String sql = "SELECT * FROM result";
        return jdbcTemplate.query(sql, new QuestionResultMapper());
    }

    @Override
    public QuestionResult findById(int id) {
        final String sql = "SELECT * FROM result WHERE result_id = ?";
        return jdbcTemplate.queryForObject(sql, new QuestionResultMapper(), id);
    }

    @Override
    public QuestionResult add(QuestionResult questionResult) {
        final String sql = "INSERT INTO result (user_id, quiz_id, question_id, option_id) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                questionResult.getUserId(),
                questionResult.getQuizId(),
                questionResult.getQuestionId(),
                questionResult.getOptionId());
        return questionResult;
    }

    @Override
    public boolean update(QuestionResult questionResult) {
        final String sql = "UPDATE result SET user_id = ?, quiz_id = ?, question_id = ?, option_id = ? WHERE result_id = ?";
        return jdbcTemplate.update(sql,
                questionResult.getUserId(),
                questionResult.getQuizId(),
                questionResult.getQuestionId(),
                questionResult.getOptionId(),
                questionResult.getResultId()) > 0;
    }

    @Override
    public boolean deleteById(int id) {
        final String sql = "DELETE FROM result WHERE result_id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
