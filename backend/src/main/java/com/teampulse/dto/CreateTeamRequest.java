package com.teampulse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Email;
import java.util.List;

public class CreateTeamRequest {

    @NotBlank(message = "Team name is required")
    private String name;

    private String city;
    private Integer budgetMin;
    private Integer budgetMax;
    private String createdBy; // organiser email
    private List<String> activityCategories;

    @NotEmpty(message = "At least one member email is required")
    private List<@Email String> memberEmails;

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
    public List<String> getActivityCategories() { return activityCategories; }
    public void setActivityCategories(List<String> activityCategories) { this.activityCategories = activityCategories; }
    public List<String> getMemberEmails() { return memberEmails; }
    public void setMemberEmails(List<String> memberEmails) { this.memberEmails = memberEmails; }
}
