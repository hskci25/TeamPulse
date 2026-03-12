package com.teampulse.controller;

import com.teampulse.domain.Member;
import com.teampulse.domain.Team;
import com.teampulse.dto.CreateTeamRequest;
import com.teampulse.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    /** Teams the current user is a member of. Requires authentication. */
    @GetMapping
    public ResponseEntity<List<Team>> listMyTeams(Authentication auth) {
        String email = auth != null ? auth.getName() : null;
        return ResponseEntity.ok(teamService.listTeamsForMember(email != null ? email : ""));
    }

    @PostMapping
    public ResponseEntity<Team> createTeam(@Valid @RequestBody CreateTeamRequest request, Authentication auth) {
        if (auth != null && auth.getName() != null) {
            request.setCreatedBy(auth.getName());
        }
        Team team = teamService.createTeam(request);
        return ResponseEntity.ok(team);
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<Team> getTeam(@PathVariable String teamId) {
        return teamService.getTeam(teamId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<Member>> getMembers(@PathVariable String teamId) {
        List<Member> members = teamService.getMembers(teamId);
        return ResponseEntity.ok(members);
    }
}
