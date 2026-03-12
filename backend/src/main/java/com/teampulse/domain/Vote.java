package com.teampulse.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Vote is keyed by voter_token only — no email stored. True anonymity.
 */
@Document(collection = "votes")
@CompoundIndex(name = "plan_token", def = "{'planId': 1, 'voterToken': 1}", unique = true)
public class Vote {

    @Id
    private String id;
    private String planId;
    private String optionId;
    private String voterToken;  // links to VoterToken, not to email
    private Instant castAt;

    public Vote() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPlanId() { return planId; }
    public void setPlanId(String planId) { this.planId = planId; }
    public String getOptionId() { return optionId; }
    public void setOptionId(String optionId) { this.optionId = optionId; }
    public String getVoterToken() { return voterToken; }
    public void setVoterToken(String voterToken) { this.voterToken = voterToken; }
    public Instant getCastAt() { return castAt; }
    public void setCastAt(Instant castAt) { this.castAt = castAt; }
}
