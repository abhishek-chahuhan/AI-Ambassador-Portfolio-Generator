package com.abhishek.aiambassador.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnhanceResponse {

    private List<HighlightDto> highlights;

    private String message;

    private boolean success;

}