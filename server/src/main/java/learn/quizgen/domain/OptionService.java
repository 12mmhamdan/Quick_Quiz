package learn.quizgen.domain;

import learn.quizgen.data.OptionRepository;
import learn.quizgen.models.Option;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OptionService {
    private final OptionRepository optionRepository;

    public OptionService(OptionRepository optionRepository) {
        this.optionRepository = optionRepository;
    }

    public List<Option> findAll() {
        return optionRepository.findAll();
    }

    public Option findById(int optionId) {
        return optionRepository.findById(optionId);
    }

    public Result<Option> add(Option option){
        Result<Option> result = validate(option);

        if (!result.isSuccess()){
            return result;
        }

        if (option.getOptionId() != 0){
            result.addMessage("optionId cannot be set for `add` operation", ResultType.INVALID);
        }

        option = optionRepository.add(option);
        result.setPayload(option);

        return result;
    }

    public Result<Option> update(Option option){
        Result<Option> result = validate(option);
        if (!result.isSuccess()) {
            return result;
        }

        if (option.getOptionId() <= 0){
            result.addMessage("optionId must be set for `update` operation", ResultType.INVALID);
            return result;
        }

        if (!optionRepository.update(option)){
            String msg = String.format("optionId: %s, not found", option.getOptionId());
            result.addMessage(msg, ResultType.NOT_FOUND);
        }

        return result;
    }

    public boolean deleteById(int optionId){
        return optionRepository.deleteById(optionId);
    }

    private Result<Option> validate(Option option) {
        Result<Option> result = new Result<>();
        if (option == null){
            result.addMessage("option cannot be null", ResultType.INVALID);
            return result;
        }

        if (option.getQuestionId() <= 0){
            result.addMessage("questionId is required and must be positive", ResultType.INVALID);
        }

        if (option.getOptionText() == null || option.getOptionText().isBlank()){
            result.addMessage("optionText is required", ResultType.INVALID);
        }

        return result;
    }
}
