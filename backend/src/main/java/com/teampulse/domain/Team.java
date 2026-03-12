package com.teampulse.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "teams")
public class Team {

    @Id
    private String id;
    private String name;
    private String city;
    private Integer budgetMin;  // in smallest currency unit if needed
    private Integer budgetMax;
    @Indexed
    private String createdBy;   // email of organiser
    private Instant createdAt;
    private List<String> activityCategories = new ArrayList<>(); // e.g. FOOD, OUTDOOR, GAMES

    public Team() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public Integer getBudgetMin() { return budgetMin; }
    public void setBudgetMin(Integer budgetMin) { this.budgetMin = budgetMin; }
    public Integer getBudgetMax() { return budgetMax; }
    public void setBudgetMax(Integer budgetMax) { this.budgetMax = budgetMax; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<String> getActivityCategories() { return activityCategories; }
    public void setActivityCategories(List<String> activityCategories) { this.activityCategories = activityCategories != null ? activityCategories : new ArrayList<>(); }
}
