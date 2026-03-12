package com.teampulse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;

public class CreatePlanRequest {

    @NotBlank
    private String teamId;

    @NotBlank
    private String title;

    @NotNull
    private Instant dateTime;

    @NotNull
    private Instant deadline;

    private String createdBy;

    @NotNull
    private List<OptionInput> options;

    public static class OptionInput {
        private String name;
        private String category;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }

    public String getTeamId() { return teamId; }
    public void setTeamId(String teamId) { this.teamId = teamId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Instant getDateTime() { return dateTime; }
    public void setDateTime(Instant dateTime) { this.dateTime = dateTime; }
    public Instant getDeadline() { return deadline; }
    public void setDeadline(Instant deadline) { this.deadline = deadline; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public List<OptionInput> getOptions() { return options; }
    public void setOptions(List<OptionInput> options) { this.options = options; }
}
