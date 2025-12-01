package learn.quizgen.data.mapper;

import learn.quizgen.models.QuizResult;
import learn.quizgen.models.Score;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class QuizResultMapper implements RowMapper<QuizResult> {
    @Override
    public QuizResult mapRow(ResultSet resultSet, int i) throws SQLException {
        QuizResult quizResult = new QuizResult(resultSet.getInt("quiz_result_id"), resultSet.getInt("user_id"),
                resultSet.getInt("quiz_id"), resultSet.getInt("correct_answers"), resultSet.getInt("total_questions"),
                resultSet.getFloat("percent_correct"), resultSet.getString("username"),
                resultSet.getString("title"), resultSet.getString("topic"));

        return quizResult;
    }
}
