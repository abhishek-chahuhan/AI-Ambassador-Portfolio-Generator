package com.abhishek.aiambassador.dto;

import lombok.Data;

import java.util.List;

@Data
public class EnhanceRequest {

    private AmbassadorDto ambassador;

    private List<HighlightDto> highlights;

}