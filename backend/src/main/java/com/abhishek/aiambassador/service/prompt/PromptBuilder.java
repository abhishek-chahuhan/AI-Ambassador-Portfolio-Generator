package com.abhishek.aiambassador.service.prompt;

import com.abhishek.aiambassador.dto.EnhanceRequest;
import com.abhishek.aiambassador.dto.HighlightDto;

public class PromptBuilder {

    public static String buildEnhancePrompt(EnhanceRequest request) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
You are an expert content writer for Google Student Ambassadors.

Improve the following monthly highlights.

Rules:
- Improve grammar.
- Improve professionalism.
- Do NOT invent achievements.
- Keep each description under 80 words.
- Keep the original type unchanged.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use ```.

Return exactly this JSON:

{
  "highlights":[
    {
      "type":"",
      "title":"",
      "description":"",
      "link":""
    }
  ],
  "message":"Enhancement successful",
  "success":true
}

If your response is not valid JSON, you have failed the task.

""");

        prompt.append("Ambassador:\n");
        prompt.append("Name: ").append(request.getAmbassador().getName()).append("\n");
        prompt.append("Role: ").append(request.getAmbassador().getRole()).append("\n");
        prompt.append("Month: ").append(request.getAmbassador().getMonth()).append("\n\n");

        prompt.append("Highlights:\n");

        for (HighlightDto h : request.getHighlights()) {

            prompt.append("Type: ").append(h.getType()).append("\n");
            prompt.append("Title: ").append(h.getTitle()).append("\n");
            prompt.append("Description: ").append(h.getDescription()).append("\n\n");

        }

        return prompt.toString();
    }
}