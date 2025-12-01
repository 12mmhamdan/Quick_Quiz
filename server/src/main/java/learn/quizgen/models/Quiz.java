package learn.quizgen.models;

public class Quiz {
    private int quizId;
    private int teacherId;
    private String title;
    private String description;
    private int numberOfQuestions;
    private int numberOfOptions;
    private String topic;
    private String prompt;
    private String quizJSON;

    private String teacherName;

    public Quiz() {
    }

    public Quiz(int quizId, int teacherId, String teacherName, String title, String description, int numberOfQuestions, int numberOfOptions, String topic, String prompt, String quizJSON) {
        this.quizId = quizId;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.title = title;
        this.description = description;
        this.numberOfQuestions = numberOfQuestions;
        this.numberOfOptions = numberOfOptions;
        this.topic = topic;
        this.prompt = prompt;
        this.quizJSON = quizJSON;
    }

    public int getQuizId() {
        return quizId;
    }

    public void setQuizId(int quizId) {
        this.quizId = quizId;
    }

    public int getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(int teacherId) {
        this.teacherId = teacherId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getNumberOfQuestions() {
        return numberOfQuestions;
    }

    public void setNumberOfQuestions(int numberOfQuestions) {
        this.numberOfQuestions = numberOfQuestions;
    }

    public int getNumberOfOptions() {
        return numberOfOptions;
    }

    public void setNumberOfOptions(int numberOfOptions) {
        this.numberOfOptions = numberOfOptions;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getQuizJSON() {
        return quizJSON;
    }

    public void setQuizJSON(String quizJSON) {
        this.quizJSON = quizJSON;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }
}
