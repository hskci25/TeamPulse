package com.teampulse.domain;

/**
 * Embedded option within a Plan (or could be a separate collection; brief says OPTIONS with plan_id).
 * Kept embedded for MVP to simplify; can split later for Team DNA.
 */
public class PlanOption {

    private String id;   // UUID for reference in votes
    private String name;
    private String category;  // e.g. FOOD, OUTDOOR

    public PlanOption() {}

    public PlanOption(String id, String name, String category) {
        this.id = id;
        this.name = name;
        this.category = category;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
