package com.abhishek.aiambassador.service;

import com.abhishek.aiambassador.dto.EnhanceRequest;
import com.abhishek.aiambassador.dto.EnhanceResponse;
import com.abhishek.aiambassador.service.prompt.PromptBuilder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.abhishek.aiambassador.dto.CaptionResponse;

@Service
public class GeminiService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.model}")
    private String model;

    public EnhanceResponse enhance(EnhanceRequest request) throws JsonProcessingException {



        String prompt = PromptBuilder.buildEnhancePrompt(request);
        String response = callGroq(prompt);

        // Print Gemini response
        System.out.println("========== GEMINI ==========");
        System.out.println(response);
        System.out.println("============================");

        // Convert JSON into Java object
        ObjectMapper mapper = new ObjectMapper();

        return mapper.readValue(response, EnhanceResponse.class);
    }
    public CaptionResponse generateCaption(EnhanceRequest request) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("""
You are an expert LinkedIn content writer for Google Student Ambassadors.

Write a professional LinkedIn caption.

Rules:

- Use the provided information as the factual foundation.
- Never invent events, numbers, awards, collaborations or achievements that were not provided.
- You MAY naturally elaborate on the impact, learning, emotions, leadership, confidence, teamwork, inspiration and personal growth resulting from the experience.
- Add thoughtful reflections that make the post feel authentic and human, but never fabricate facts.
- Write like a real Google Student Ambassador sharing a genuine monthly reflection on LinkedIn.
- Avoid robotic, repetitive or AI-generated wording.
- Use smooth transitions instead of simply listing achievements.
- Keep the tone professional, humble, positive and inspiring.
- Write between 70 and 100 words.
- Prefer 2 short paragraphs for better readability.
- Do NOT include hashtags.
- Do NOT include @mentions.
- Return ONLY the caption text.
""");

        prompt.append("\n\nAmbassador:\n");
        prompt.append("Name: ").append(request.getAmbassador().getName()).append("\n");
        prompt.append("Role: ").append(request.getAmbassador().getRole()).append("\n");
        prompt.append("Month: ").append(request.getAmbassador().getMonth()).append("\n\n");

        prompt.append("Highlights:\n");
        prompt.append("Use these highlights naturally throughout the caption instead of listing them one by one.\n\n");

        request.getHighlights().forEach(h -> {
            prompt.append("- ")
                    .append(h.getTitle())
                    .append(": ")
                    .append(h.getDescription())
                    .append("\n");
        });
        String response = callGroq(prompt.toString());

        String finalCaption = appendMandatoryFooter(response);

        return new CaptionResponse(finalCaption);
    }
    private String appendMandatoryFooter(String caption) {

        StringBuilder result = new StringBuilder();

        result.append(caption.trim());

        result.append("\n\n");

        result.append("@GoogleIndia @GoogleGemini\n\n");

        result.append("#GoogleStudentAmbassador ");
        result.append("#MonthlyHighlights ");
        result.append("#GSA2026 ");
        result.append("#TeamGemini ");
        result.append("#CommuniqueIndia ");
        result.append("#ping_mcn");

        return result.toString();
    }
    private String callGroq(String prompt) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);

        body.put("messages", List.of(
                Map.of(
                        "role", "user",
                        "content", prompt
                )
        ));

        body.put("temperature", 0.8);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        Map response = restTemplate.postForObject(
                "https://api.groq.com/openai/v1/chat/completions",
                entity,
                Map.class
        );

        List choices = (List) response.get("choices");
        Map first = (Map) choices.get(0);
        Map message = (Map) first.get("message");

        return message.get("content").toString();
    }

}
