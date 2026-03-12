package com.teampulse.service;

import com.teampulse.domain.Member;
import com.teampulse.domain.Team;
import com.teampulse.dto.CreateTeamRequest;
import com.teampulse.repository.MemberRepository;
import com.teampulse.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final MemberRepository memberRepository;
    private final EmailService emailService;

    public TeamService(TeamRepository teamRepository, MemberRepository memberRepository, EmailService emailService) {
        this.teamRepository = teamRepository;
        this.memberRepository = memberRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Team createTeam(CreateTeamRequest req) {
        Team team = new Team();
        team.setName(req.getName());
        team.setCity(req.getCity());
        team.setBudgetMin(req.getBudgetMin());
        team.setBudgetMax(req.getBudgetMax());
        team.setCreatedBy(req.getCreatedBy() != null ? req.getCreatedBy() : req.getMemberEmails().get(0));
        team.setCreatedAt(Instant.now());
        if (req.getActivityCategories() != null) {
            team.setActivityCategories(req.getActivityCategories());
        }
        team = teamRepository.save(team);

        for (String email : req.getMemberEmails()) {
            if (memberRepository.existsByTeamIdAndEmail(team.getId(), email)) continue;
            Member m = new Member(team.getId(), email.trim().toLowerCase());
            memberRepository.save(m);
        }

        emailService.sendWelcomeEmails(team, memberRepository.findByTeamId(team.getId()));
        return team;
    }

    public Optional<Team> getTeam(String teamId) {
        return teamRepository.findById(teamId);
    }

    public List<Member> getMembers(String teamId) {
        return memberRepository.findByTeamId(teamId);
    }

    /** Returns teams the given email is a member of. If memberEmail is blank, returns empty list. */
    public List<Team> listTeamsForMember(String memberEmail) {
        if (memberEmail == null || memberEmail.isBlank()) {
            return List.of();
        }
        String email = memberEmail.trim().toLowerCase();
        List<Member> members = memberRepository.findByEmailIgnoreCase(email);
        if (members.isEmpty()) return List.of();
        List<String> teamIds = members.stream().map(Member::getTeamId).distinct().toList();
        return teamRepository.findAllById(teamIds);
    }
}
