package com.teampulse.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "members")
@CompoundIndex(name = "team_email", def = "{'teamId': 1, 'email': 1}", unique = true)
public class Member {

    @Id
    private String id;
    private String teamId;
    private String email;
    private Instant joinedAt;

    public Member() {}

    public Member(String teamId, String email) {
        this.teamId = teamId;
        this.email = email;
        this.joinedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTeamId() { return teamId; }
    public void setTeamId(String teamId) { this.teamId = teamId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Instant getJoinedAt() { return joinedAt; }
    public void setJoinedAt(Instant joinedAt) { this.joinedAt = joinedAt; }
}
