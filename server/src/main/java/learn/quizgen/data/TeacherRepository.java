package learn.quizgen.data;

import learn.quizgen.models.Teacher;

import java.util.List;

public interface TeacherRepository {
    List<Teacher> findAll();

    Teacher findById(int id);

    Teacher findByUserId(int userId);

    Teacher add(Teacher teacher);

    boolean update(Teacher teacher);

    boolean deleteById(int id);
}
