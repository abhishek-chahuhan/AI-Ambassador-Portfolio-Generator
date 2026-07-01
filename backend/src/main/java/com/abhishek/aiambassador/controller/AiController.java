package com.abhishek.aiambassador.controller;

import com.abhishek.aiambassador.dto.EnhanceRequest;
import com.abhishek.aiambassador.dto.EnhanceResponse;
import com.abhishek.aiambassador.service.GeminiService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
public class AiController {

    private final GeminiService geminiService;

    @PostMapping("/enhance")
    public EnhanceResponse enhance(@RequestBody EnhanceRequest request) throws JsonProcessingException {

        System.out.println(request);

        return geminiService.enhance(request);

    }
}