package com.abhishek.aiambassador.service;

import com.abhishek.aiambassador.dto.EnhanceRequest;
import com.abhishek.aiambassador.dto.EnhanceResponse;
import com.abhishek.aiambassador.service.prompt.PromptBuilder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.abhishek.aiambassador.dto.CaptionResponse;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    public EnhanceResponse enhance(EnhanceRequest request) throws JsonProcessingException {

        Client client = Client.builder()
                .apiKey(apiKey)
                .build();

        // Build prompt
        String prompt = PromptBuilder.buildEnhancePrompt(request);

        // Send to Gemini
        GenerateContentResponse response =
                client.models.generateContent(
                        model,
                        prompt,
                        null
                );

        // Print Gemini response
        System.out.println("========== GEMINI ==========");
        System.out.println(response.text());
        System.out.println("============================");

        // Convert JSON into Java object
        ObjectMapper mapper = new ObjectMapper();

        return mapper.readValue(response.text(), EnhanceResponse.class);
    }
    public CaptionResponse generateCaption(EnhanceRequest request) {

        Client client = Client.builder()
                .apiKey(apiKey)
                .build();

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

        GenerateContentResponse response =
                client.models.generateContent(
                        model,
                        prompt.toString(),
                        null
                );

        String finalCaption = appendMandatoryFooter(response.text());

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
}