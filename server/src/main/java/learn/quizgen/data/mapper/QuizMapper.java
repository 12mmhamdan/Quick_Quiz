package learn.quizgen.data.mapper;

import learn.quizgen.models.Quiz;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class QuizMapper implements RowMapper<Quiz> {
    @Override
    public Quiz mapRow(ResultSet resultSet, int i) throws SQLException {
        String quizJSON = resultSet.getString("quiz_json");
        System.out.println("quiz_json from database: " + quizJSON); // Log the quiz_json value

        Quiz quiz = new Quiz(resultSet.getInt("quiz_id"), resultSet.getInt("teacher_id"), resultSet.getString("last_name"),
                resultSet.getString("title"), resultSet.getString("description"),
                resultSet.getInt("number_of_questions"), resultSet.getInt("number_of_options"),
                resultSet.getString("topic"), resultSet.getString("prompt"), quizJSON);

        return quiz;
    }
}
