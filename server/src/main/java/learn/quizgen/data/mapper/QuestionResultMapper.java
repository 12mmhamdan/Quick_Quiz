package learn.quizgen.data.mapper;
import learn.quizgen.models.QuestionResult;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class QuestionResultMapper implements RowMapper<QuestionResult> {
    @Override
    public QuestionResult mapRow(ResultSet resultSet, int i) throws SQLException {
        QuestionResult questionResult = new QuestionResult(resultSet.getInt("result_id"), resultSet.getInt("user_id"),
                resultSet.getInt("quiz_id"), resultSet.getInt("question_id"), resultSet.getInt("option_id"));

        return questionResult;
    }
}