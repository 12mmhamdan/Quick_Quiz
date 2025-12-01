package learn.quizgen.domain;

import learn.quizgen.data.ScoreRepository;
import learn.quizgen.domain.Result;
import learn.quizgen.domain.ResultType;
import learn.quizgen.models.Score;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository scoreRepository;

    public ScoreService(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    public Result<List<Score>> findAll() {
        Result<List<Score>> result = new Result<>();
        List<Score> scores = scoreRepository.findAll();

        if (scores == null || scores.isEmpty()) {
            result.addMessage("No scores found.", ResultType.NOT_FOUND);
        } else {
            result.setPayload(scores);
        }

        return result;
    }

    public Result<Score> findById(int id) {
        Result<Score> result = new Result<>();
        Score score = scoreRepository.findById(id);

        if (score == null) {
            result.addMessage("Score not found.", ResultType.NOT_FOUND);
        } else {
            result.setPayload(score);
        }

        return result;
    }

    public Result<Score> add(Score score) {
        Result<Score> result = validateScore(score);

        if (!result.isSuccess()) {
            return result;
        }

        Score createdScore = scoreRepository.add(score);
        result.setPayload(createdScore);
        return result;
    }

    public Result<Score> update(Score score) {
        Result<Score> result = validateScore(score);

        if (!result.isSuccess()) {
            return result;
        }

        boolean success = scoreRepository.update(score);
        if (!success) {
            result.addMessage("Score update failed.", ResultType.ERROR);
        } else {
            result.setPayload(score);
        }

        return result;
    }

    public Result<Void> deleteById(int id) {
        Result<Void> result = new Result<>();

        boolean success = scoreRepository.deleteById(id);
        if (!success) {
            result.addMessage("Score not found or could not be deleted.", ResultType.NOT_FOUND);
        } else {
            result.addMessage("Score successfully deleted.", ResultType.SUCCESS);
        }

        return result;
    }

    private Result<Score> validateScore(Score score) {
        Result<Score> result = new Result<>();

        if (score.getUserId() <= 0) {
            result.addMessage("User ID is required and must be positive.", ResultType.INVALID);
        }
        if (score.getQuizId() <= 0) {
            result.addMessage("Quiz ID is required and must be positive.", ResultType.INVALID);
        }
        if (score.getScore() < 0 || score.getScore() > 100) {
            result.addMessage("Score must be between 0 and 100.", ResultType.INVALID);
        }

        return result;
    }
}
