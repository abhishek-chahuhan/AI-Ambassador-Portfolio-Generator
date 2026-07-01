package com.abhishek.aiambassador.controller;

import com.abhishek.aiambassador.dto.CaptionResponse;
import com.abhishek.aiambassador.dto.EnhanceRequest;
import com.abhishek.aiambassador.service.GeminiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class CaptionController {

    private final GeminiService geminiService;

    public CaptionController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/caption")
    public CaptionResponse generateCaption(@RequestBody EnhanceRequest request) throws Exception {

        return geminiService.generateCaption(request);

    }
}