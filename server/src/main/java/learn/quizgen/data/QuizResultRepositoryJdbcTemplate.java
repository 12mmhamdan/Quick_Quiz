package learn.quizgen.data;

import learn.quizgen.data.mapper.QuizResultMapper;
import learn.quizgen.models.QuizResult;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class QuizResultRepositoryJdbcTemplate implements QuizResultRepository {

    private final JdbcTemplate jdbcTemplate;

    public QuizResultRepositoryJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<QuizResult> findAll() {
        final String sql = "SELECT * FROM quick_quiz.quiz_result join quiz on quiz.quiz_id = quiz_result.quiz_id join app_user on quiz_result.user_id = app_user.user_id";
        return jdbcTemplate.query(sql, new QuizResultMapper());
    }

    @Override
    public QuizResult findById(int id) {
        final String sql = "SELECT * FROM quiz_result WHERE quiz_result_id = ?";
        return jdbcTemplate.queryForObject(sql, new QuizResultMapper(), id);
    }

    @Override
    public QuizResult add(QuizResult quiz) {
        final String sql = "INSERT INTO quiz_result (user_id, quiz_id, correct_answers, total_questions, percent_correct) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                quiz.getUserId(),
                quiz.getQuizId(),
                quiz.getCorrectAnswers(),
                quiz.getTotalQuestions(),
                quiz.getScore());
        return quiz;
    }

    @Override
    public boolean update(QuizResult quiz) {
        final String sql = "UPDATE quiz_result SET user_id = ?, quiz_id = ?, correct_answers = ?, total_questions = ?, percent_correct = ? WHERE quiz_id = ?";
        return jdbcTemplate.update(sql,
                quiz.getUserId(),
                quiz.getQuizId(),
                quiz.getCorrectAnswers(),
                quiz.getTotalQuestions(),
                quiz.getScore(),
                quiz.getQuizId()) > 0;
    }

    @Override
    public boolean deleteById(int id) {
        final String sql = "DELETE FROM quiz_result WHERE quiz_result_id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
