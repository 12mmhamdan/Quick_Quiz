package learn.quizgen.data;

import learn.quizgen.data.mapper.QuizMapper;
import learn.quizgen.models.Quiz;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.dao.EmptyResultDataAccessException;

import java.sql.PreparedStatement;
import java.util.List;

@Repository
public class QuizRepositoryJdbcTemplate implements QuizRepository {

    private final JdbcTemplate jdbcTemplate;

    public QuizRepositoryJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Quiz> findAll() {
        final String sql = "SELECT * FROM quick_quiz.quiz join teacher on quiz.teacher_id = teacher.teacher_id join app_user on teacher.user_id = app_user.user_id";
        return jdbcTemplate.query(sql, new QuizMapper());
    }

    @Override
    public Quiz findById(int id) {
        final String sql = "SELECT * FROM quick_quiz.quiz join teacher on quiz.teacher_id = teacher.teacher_id join app_user on teacher.user_id = app_user.user_id WHERE quiz_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new QuizMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            return null;  // Return null if quiz is not found
        }
    }

    @Override
    public Quiz add(Quiz quiz) {

        if (quiz.getTeacherId() <= 0) {
            throw new IllegalArgumentException("teacherId must be set before saving a quiz.");
        }

        final String sql = "INSERT INTO quiz (teacher_id, title, description, number_of_questions, number_of_options, topic, prompt, quiz_json) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"quiz_id"});
            ps.setInt(1, quiz.getTeacherId());
            ps.setString(2, quiz.getTitle());
            ps.setString(3, quiz.getDescription());
            ps.setInt(4, quiz.getNumberOfQuestions());
            ps.setInt(5, quiz.getNumberOfOptions());
            ps.setString(6, quiz.getTopic());
            ps.setString(7, quiz.getPrompt());
            ps.setString(8, quiz.getQuizJSON());
            return ps;
        }, keyHolder);

        quiz.setQuizId(keyHolder.getKey().intValue());
        return quiz;
    }

    @Override
    public boolean update(Quiz quiz) {
        if (quiz.getTeacherId() <= 0) {
            throw new IllegalArgumentException("teacherId must be set before updating a quiz.");
        }

        final String sql = "UPDATE quiz SET teacher_id = ?, title = ?, description = ?, number_of_questions = ?, number_of_options = ?, topic = ?, prompt = ?, quiz_json = ? WHERE quiz_id = ?";
        return jdbcTemplate.update(sql,
                quiz.getTeacherId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getNumberOfQuestions(),
                quiz.getNumberOfOptions(),
                quiz.getTopic(),
                quiz.getPrompt(),
                quiz.getQuizJSON(),
                quiz.getQuizId()) > 0;


    }

    @Override
    public boolean deleteById(int id) {
        final String sql = "DELETE FROM quiz WHERE quiz_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);
        return rowsAffected > 0;  // Return true if the quiz was deleted, false otherwise
    }
}
