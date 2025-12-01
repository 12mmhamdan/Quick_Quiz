package learn.quizgen.data;

import learn.quizgen.data.mapper.ScoreMapper;
import learn.quizgen.models.Score;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ScoreRepositoryJdbcTemplate implements ScoreRepository {

    private final JdbcTemplate jdbcTemplate;

    public ScoreRepositoryJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Score> findAll() {
        final String sql = "SELECT * FROM score";
        return jdbcTemplate.query(sql, new ScoreMapper());
    }

    @Override
    public Score findById(int id) {
        final String sql = "SELECT * FROM score WHERE score_id = ?";
        return jdbcTemplate.queryForObject(sql, new ScoreMapper(), id);
    }

    @Override
    public Score add(Score score) {
        final String sql = "INSERT INTO score (user_id, quiz_id, score) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql,
                score.getUserId(),
                score.getQuizId(),
                score.getScore());
        return score;
    }

    @Override
    public boolean update(Score score) {
        final String sql = "UPDATE score SET user_id = ?, quiz_id = ?, score = ? WHERE score_id = ?";
        return jdbcTemplate.update(sql,
                score.getUserId(),
                score.getQuizId(),
                score.getScore(),
                score.getScoreId()) > 0;
    }

    @Override
    public boolean deleteById(int id) {
        final String sql = "DELETE FROM score WHERE score_id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
