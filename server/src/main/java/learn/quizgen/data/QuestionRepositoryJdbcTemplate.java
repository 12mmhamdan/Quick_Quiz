package learn.quizgen.data;

import learn.quizgen.data.mapper.OptionMapper;
import learn.quizgen.data.mapper.QuestionMapper;
import learn.quizgen.models.Question;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class QuestionRepositoryJdbcTemplate implements QuestionRepository {

    private final JdbcTemplate jdbcTemplate;

    public QuestionRepositoryJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Question> findAll() {
        final String sql = "SELECT * FROM question";
        return jdbcTemplate.query(sql, new QuestionMapper());
    }

    @Override
    public List<Question> findByQuizId(int id) {
        final String sql = "SELECT * FROM quick_quiz.question join quiz on quiz.quiz_id = question.quiz_id" +
                " WHERE question.quiz_id = ?";

        List<Question> questions = jdbcTemplate.query(sql, new QuestionMapper(), id);

        final String sql2 = "SELECT * FROM quick_quiz.question join quiz on quiz.quiz_id = question.quiz_id join `option` on `option`.question_id = question.question_id WHERE `option`.question_id = ?";

        for (int i = 0; i < questions.size(); i++) {
            questions.get(i).setOptionList(jdbcTemplate.query(sql2, new OptionMapper(), questions.get(i).getQuestionId()));
        }

        return questions;
    }

    @Override
    public Question add(Question question) {
        final String sql = "INSERT INTO question (quiz_id, question_text) VALUES (?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, question.getQuizId());
            ps.setString(2, question.getQuestionText());
            return ps;
        }, keyHolder);
        question.setQuestionId(keyHolder.getKey().intValue());
        return question;
    }

    @Override
    public boolean update(Question question) {
        final String sql = "UPDATE question SET quiz_id = ?, question_text = ? WHERE question_id = ?";
        return jdbcTemplate.update(sql,
                question.getQuizId(),
                question.getQuestionText(),
                question.getQuestionId()) > 0;
    }

    @Override
    public boolean deleteById(int id) {
        final String sql = "DELETE FROM question WHERE question_id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
