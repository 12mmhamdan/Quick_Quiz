package learn.quizgen.data.mapper;
import learn.quizgen.models.Score;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ScoreMapper implements RowMapper<Score> {
    @Override
    public Score mapRow(ResultSet resultSet, int i) throws SQLException {
        Score score = new Score(resultSet.getInt("score_id"), resultSet.getInt("user_id"),
                resultSet.getInt("quiz_id"), resultSet.getDouble("score"));

        return score;
    }
}