package com.teampulse.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "plans")
public class Plan {

    @Id
    private String id;
    @Indexed
    private String teamId;
    private String title;
    private Instant dateTime;       // when the activity is scheduled
    private Instant deadline;       // when voting closes
    private PlanStatus status = PlanStatus.PENDING;
    private String winnerOptionId;  // id of winning Option when CONFIRMED
    private String createdBy;       // email
    private Instant createdAt;
    private List<PlanOption> options = new ArrayList<>();

    public enum PlanStatus {
        PENDING,   // voting open
        CONFIRMED, // at least one vote, winner chosen
        CANCELLED  // no votes by deadline
    }

    public Plan() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTeamId() { return teamId; }
    public void setTeamId(String teamId) { this.teamId = teamId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Instant getDateTime() { return dateTime; }
    public void setDateTime(Instant dateTime) { this.dateTime = dateTime; }
    public Instant getDeadline() { return deadline; }
    public void setDeadline(Instant deadline) { this.deadline = deadline; }
    public PlanStatus getStatus() { return status; }
    public void setStatus(PlanStatus status) { this.status = status; }
    public String getWinnerOptionId() { return winnerOptionId; }
    public void setWinnerOptionId(String winnerOptionId) { this.winnerOptionId = winnerOptionId; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<PlanOption> getOptions() { return options; }
    public void setOptions(List<PlanOption> options) { this.options = options != null ? options : new ArrayList<>(); }
}
