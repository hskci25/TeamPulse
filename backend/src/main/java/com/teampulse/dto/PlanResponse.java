package com.teampulse.dto;

import com.teampulse.domain.Plan;
import com.teampulse.domain.PlanOption;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public class PlanResponse {

    private String id;
    private String teamId;
    private String title;
    private Instant dateTime;
    private Instant deadline;
    private Plan.PlanStatus status;
    private String winnerOptionId;
    private String createdBy;
    private Instant createdAt;
    private List<OptionResponse> options;
    private Integer memberCount;
    private Integer voteCount;  // live participation count
    private String teamName;   // set when listing "my plans"

    public static class OptionResponse {
        private String id;
        private String name;
        private String category;
        private Integer voteCount;  // for result view

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public Integer getVoteCount() { return voteCount; }
        public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }
    }

    public static PlanResponse from(Plan plan, int memberCount, int voteCount, List<Integer> optionVoteCounts) {
        PlanResponse r = new PlanResponse();
        r.setId(plan.getId());
        r.setTeamId(plan.getTeamId());
        r.setTitle(plan.getTitle());
        r.setDateTime(plan.getDateTime());
        r.setDeadline(plan.getDeadline());
        r.setStatus(plan.getStatus());
        r.setWinnerOptionId(plan.getWinnerOptionId());
        r.setCreatedBy(plan.getCreatedBy());
        r.setCreatedAt(plan.getCreatedAt());
        r.setMemberCount(memberCount);
        r.setVoteCount(voteCount);
        if (plan.getOptions() != null && optionVoteCounts != null && plan.getOptions().size() == optionVoteCounts.size()) {
            List<OptionResponse> opts = new java.util.ArrayList<>();
            for (int i = 0; i < plan.getOptions().size(); i++) {
                PlanOption o = plan.getOptions().get(i);
                OptionResponse or = new OptionResponse();
                or.setId(o.getId());
                or.setName(o.getName());
                or.setCategory(o.getCategory());
                or.setVoteCount(optionVoteCounts.size() > i ? optionVoteCounts.get(i) : 0);
                opts.add(or);
            }
            r.setOptions(opts);
        } else {
            r.setOptions(plan.getOptions() != null ? plan.getOptions().stream().map(o -> {
                OptionResponse or = new OptionResponse();
                or.setId(o.getId());
                or.setName(o.getName());
                or.setCategory(o.getCategory());
                return or;
            }).collect(Collectors.toList()) : List.of());
        }
        return r;
    }

    // getters/setters
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
    public Plan.PlanStatus getStatus() { return status; }
    public void setStatus(Plan.PlanStatus status) { this.status = status; }
    public String getWinnerOptionId() { return winnerOptionId; }
    public void setWinnerOptionId(String winnerOptionId) { this.winnerOptionId = winnerOptionId; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<OptionResponse> getOptions() { return options; }
    public void setOptions(List<OptionResponse> options) { this.options = options; }
    public Integer getMemberCount() { return memberCount; }
    public void setMemberCount(Integer memberCount) { this.memberCount = memberCount; }
    public Integer getVoteCount() { return voteCount; }
    public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
}
