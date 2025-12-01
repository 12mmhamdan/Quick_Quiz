package learn.quizgen.domain;

import learn.quizgen.models.Quiz;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;

public class AIApiService {
    private final String apiKey = "YOUR_API_KEY";
    private final String apiUrl = "https://api.openai.com/v1/completions"; // Endpoint for text completion
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper; // For JSON parsing

    public AIApiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public Quiz generateQuiz(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        // Prepare your request body
        String requestBody = "{"
                + "\"model\": \"gpt-3.5-turbo\","
                + "\"messages\": [{\"role\": \"user\", \"content\": \"" + prompt + "\"}],"
                + "\"max_tokens\": 150" // Adjust as needed
                + "}";

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        // Make the API call
        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestEntity, String.class);

        // Parse the response
        return parseResponse(response.getBody());
    }


    private Quiz parseResponse(String jsonResponse) {
        try {
            return objectMapper.readValue(jsonResponse, Quiz.class);
        } catch (Exception e) {
            // Handle parsing exception
            e.printStackTrace();
            return null; // Or handle accordingly
        }
    }
}
