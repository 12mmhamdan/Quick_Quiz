package learn.quizgen.data.mapper;

import learn.quizgen.models.Question;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class QuestionMapper implements RowMapper<Question> {
    @Override
    public Question mapRow(ResultSet resultSet, int i) throws SQLException {
        Question question = new Question(resultSet.getInt("question_id"), resultSet.getInt("quiz_id"),
                resultSet.getString("question_text"));

        return question;
    }
}