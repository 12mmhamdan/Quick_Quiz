package learn.quizgen.data.mapper;

import learn.quizgen.models.Option;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class OptionMapper implements RowMapper<Option> {
    @Override
    public Option mapRow(ResultSet resultSet, int i) throws SQLException {
        Option option = new Option(resultSet.getInt("option_id"), resultSet.getInt("question_id"),
                resultSet.getString("option_text"), resultSet.getBoolean("is_correct"));

        return option;
    }
}