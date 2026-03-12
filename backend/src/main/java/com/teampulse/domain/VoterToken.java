package com.teampulse.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "voter_tokens")
@CompoundIndex(name = "plan_token", def = "{'planId': 1, 'token': 1}", unique = true)
public class VoterToken {

    @Id
    private String id;
    private String planId;
    private String memberEmail;
    private String token;   // UUID, used in vote link — email never stored with vote
    private boolean used;
    private Instant createdAt;

    public VoterToken() {}

    public VoterToken(String planId, String memberEmail, String token) {
        this.planId = planId;
        this.memberEmail = memberEmail;
        this.token = token;
        this.used = false;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPlanId() { return planId; }
    public void setPlanId(String planId) { this.planId = planId; }
    public String getMemberEmail() { return memberEmail; }
    public void setMemberEmail(String memberEmail) { this.memberEmail = memberEmail; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
