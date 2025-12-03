package learn.quizgen.domain;

import learn.quizgen.data.TeacherRepository;
import learn.quizgen.models.Teacher;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {
    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public List<Teacher> findAll() {
        return teacherRepository.findAll();
    }

    public Teacher findById(int optionId) {
        return teacherRepository.findById(optionId);
    }

    // 🔹 NEW
    public Teacher findByUserId(int userId) {
        return teacherRepository.findByUserId(userId);
    }

    public Result<Teacher> add(Teacher teacher){
        Result<Teacher> result = validate(teacher);

        if (!result.isSuccess()){
            return result;
        }

        if (teacher.getTeacherId() != 0){
            result.addMessage("teacherId cannot be set for `add` operation", ResultType.INVALID);
        }

        teacher = teacherRepository.add(teacher);
        result.setPayload(teacher);

        return result;
    }


    public Result<Teacher> update(Teacher teacher){
        Result<Teacher> result = validate(teacher);
        if (!result.isSuccess()) {
            return result;
        }

        if (teacher.getTeacherId() <= 0){
            result.addMessage("teacherId must be set for `update` operation", ResultType.INVALID);
            return result;
        }

        if (!teacherRepository.update(teacher)){
            String msg = String.format("optionId: %s, not found", teacher.getTeacherId());
            result.addMessage(msg, ResultType.NOT_FOUND);
        }

        return result;
    }

    public boolean deleteById(int optionId){
        return teacherRepository.deleteById(optionId);
    }

    private Result<Teacher> validate(Teacher teacher) {
        Result<Teacher> result = new Result<>();
        if (teacher == null){
            result.addMessage("teacher cannot be null", ResultType.INVALID);
            return result;
        }

        if (teacher.getUserId() <= 0){
            result.addMessage("userId is required and must be positive", ResultType.INVALID);
        }

        return result;
    }
}

