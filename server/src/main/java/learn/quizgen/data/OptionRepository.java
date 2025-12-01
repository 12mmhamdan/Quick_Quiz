package learn.quizgen.data;

import learn.quizgen.models.Option;

import java.util.List;

public interface OptionRepository {
    List<Option> findAll();

    Option findById(int id);

    Option add(Option option);

    boolean update(Option option);

    boolean deleteById(int id);
}
