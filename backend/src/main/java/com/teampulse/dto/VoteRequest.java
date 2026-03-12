package com.teampulse.dto;

import jakarta.validation.constraints.NotBlank;

public class VoteRequest {

    @NotBlank
    private String optionId;

    public String getOptionId() { return optionId; }
    public void setOptionId(String optionId) { this.optionId = optionId; }
}
