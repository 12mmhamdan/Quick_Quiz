package learn.quizgen.data.mapper;
import learn.quizgen.models.Teacher;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TeacherMapper implements RowMapper<Teacher> {
    @Override
    public Teacher mapRow(ResultSet resultSet, int i) throws SQLException {
        Teacher teacher = new Teacher(resultSet.getInt("teacher_id"), resultSet.getInt("user_id"));

        return teacher;
    }
}