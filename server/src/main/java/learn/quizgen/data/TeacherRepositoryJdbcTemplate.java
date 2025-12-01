package learn.quizgen.data;

import learn.quizgen.data.mapper.TeacherMapper;
import learn.quizgen.models.Teacher;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TeacherRepositoryJdbcTemplate implements TeacherRepository {

    private final JdbcTemplate jdbcTemplate;

    public TeacherRepositoryJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Teacher> findAll() {
        final String sql = "SELECT * FROM teacher";
        return jdbcTemplate.query(sql, new TeacherMapper());
    }

    @Override
    public Teacher findById(int id) {
        final String sql = "SELECT * FROM teacher WHERE teacher_id = ?";
        return jdbcTemplate.queryForObject(sql, new TeacherMapper(), id);
    }

    @Override
    public Teacher add(Teacher teacher) {
        final String sql = "INSERT INTO teacher (user_id) VALUES (?)";
        jdbcTemplate.update(sql, teacher.getUserId());
        return teacher;
    }

    @Override
    public boolean update(Teacher teacher) {
        final String sql = "UPDATE teacher SET user_id = ? WHERE teacher_id = ?";
        return jdbcTemplate.update(sql,
                teacher.getUserId(),
                teacher.getTeacherId()) > 0;
    }

    @Override
    public boolean deleteById(int id) {
        final String sql = "DELETE FROM teacher WHERE teacher_id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
