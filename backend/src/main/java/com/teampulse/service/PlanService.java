package com.teampulse.service;

import com.teampulse.domain.Member;
import com.teampulse.domain.Plan;
import com.teampulse.domain.PlanOption;
import com.teampulse.domain.Team;
import com.teampulse.domain.VoterToken;
import com.teampulse.dto.CreatePlanRequest;
import com.teampulse.dto.PlanResponse;
import com.teampulse.repository.MemberRepository;
import com.teampulse.repository.PlanRepository;
import com.teampulse.repository.VoteRepository;
import com.teampulse.repository.TeamRepository;
import com.teampulse.repository.VoterTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlanService {

    private static final Logger log = LoggerFactory.getLogger(PlanService.class);

    /** Minimum participation to confirm: >0% (at least one vote). */
    private static final double QUORUM_PERCENT = 0;

    private final PlanRepository planRepository;
    private final MemberRepository memberRepository;
    private final VoterTokenRepository voterTokenRepository;
    private final VoteRepository voteRepository;
    private final TeamRepository teamRepository;
    private final EmailService emailService;

    public PlanService(PlanRepository planRepository, MemberRepository memberRepository,
                       VoterTokenRepository voterTokenRepository, VoteRepository voteRepository,
                       TeamRepository teamRepository, EmailService emailService) {
        this.planRepository = planRepository;
        this.memberRepository = memberRepository;
        this.voterTokenRepository = voterTokenRepository;
        this.voteRepository = voteRepository;
        this.teamRepository = teamRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Plan createPlan(CreatePlanRequest req) {
        Optional<Team> teamOpt = teamRepository.findById(req.getTeamId());
        if (teamOpt.isEmpty()) throw new IllegalArgumentException("Team not found: " + req.getTeamId());

        Plan plan = new Plan();
        plan.setTeamId(req.getTeamId());
        plan.setTitle(req.getTitle());
        plan.setDateTime(req.getDateTime());
        plan.setDeadline(req.getDeadline());
        plan.setCreatedBy(req.getCreatedBy());
        plan.setCreatedAt(Instant.now());
        plan.setStatus(Plan.PlanStatus.PENDING);

        List<PlanOption> options = new ArrayList<>();
        for (CreatePlanRequest.OptionInput o : req.getOptions()) {
            options.add(new PlanOption(UUID.randomUUID().toString(), o.getName(), o.getCategory() != null ? o.getCategory() : "OTHER"));
        }
        plan.setOptions(options);
        plan = planRepository.save(plan);

        List<Member> members = memberRepository.findByTeamId(req.getTeamId());
        List<VoterToken> tokens = new ArrayList<>();
        for (Member m : members) {
            String token = UUID.randomUUID().toString();
            VoterToken vt = new VoterToken(plan.getId(), m.getEmail(), token);
            voterTokenRepository.save(vt);
            tokens.add(vt);
        }

        emailService.sendVoteInviteEmails(plan, teamOpt.get(), tokens);
        return plan;
    }

    public Optional<PlanResponse> getPlan(String planId) {
        return planRepository.findById(planId).map(this::toResponse);
    }

    public Optional<PlanResponse> getPlanByToken(String planId, String token) {
        Optional<VoterToken> vt = voterTokenRepository.findByPlanIdAndToken(planId, token);
        if (vt.isEmpty()) return Optional.empty();
        return getPlan(planId);
    }

    public List<PlanResponse> getPlansByTeam(String teamId) {
        List<Plan> plans = planRepository.findByTeamId(teamId);
        return plans.stream().map(this::toResponse).toList();
    }

    /** All plans from teams the given email is a member of. Sorted by createdAt desc. Includes teamName. */
    public List<PlanResponse> getPlansForMember(String memberEmail) {
        if (memberEmail == null || memberEmail.isBlank()) return List.of();
        String email = memberEmail.trim().toLowerCase();
        List<Member> members = memberRepository.findByEmailIgnoreCase(email);
        if (members.isEmpty()) return List.of();
        List<String> teamIds = members.stream().map(Member::getTeamId).distinct().toList();
        java.util.Map<String, String> teamNames = new java.util.HashMap<>();
        for (String tid : teamIds) {
            teamRepository.findById(tid).ifPresent(t -> teamNames.put(tid, t.getName()));
        }
        List<PlanResponse> result = new ArrayList<>();
        for (String teamId : teamIds) {
            for (Plan plan : planRepository.findByTeamId(teamId)) {
                PlanResponse pr = toResponse(plan);
                pr.setTeamName(teamNames.get(teamId));
                result.add(pr);
            }
        }
        result.sort((a, b) -> {
            Instant ca = a.getCreatedAt();
            Instant cb = b.getCreatedAt();
            if (ca == null && cb == null) return 0;
            if (ca == null) return 1;
            if (cb == null) return -1;
            return cb.compareTo(ca);
        });
        return result;
    }

    private PlanResponse toResponse(Plan plan) {
        int memberCount = memberRepository.findByTeamId(plan.getTeamId()).size();
        long voteCount = voteRepository.countByPlanId(plan.getId());
        List<Integer> optionVoteCounts = new ArrayList<>();
        for (PlanOption o : plan.getOptions()) {
            optionVoteCounts.add((int) voteRepository.findByPlanId(plan.getId()).stream()
                .filter(v -> o.getId().equals(v.getOptionId())).count());
        }
        return PlanResponse.from(plan, memberCount, (int) voteCount, optionVoteCounts);
    }

    public int getParticipationCount(String planId) {
        return (int) voteRepository.countByPlanId(planId);
    }

    /** Called by cron: resolve plans whose deadline has passed. Returns number of plans processed. */
    @Transactional
    public int processDeadlinePassed() {
        Instant now = Instant.now();
        List<Plan> pending = planRepository.findByStatusAndDeadlineBefore(Plan.PlanStatus.PENDING, now);
        if (pending.isEmpty()) {
            log.info("Deadline check: no plans to process (cutoff: {} UTC). Need a plan with status=PENDING and deadline before this time.", now);
            return 0;
        }
        log.info("Found {} plan(s) past deadline to process: {}", pending.size(),
            pending.stream().map(Plan::getId).toList());
        for (Plan plan : pending) {
            resolvePlan(plan);
        }
        return pending.size();
    }

    private void resolvePlan(Plan plan) {
        List<Member> members = memberRepository.findByTeamId(plan.getTeamId());
        int total = members.size();
        long voted = voteRepository.countByPlanId(plan.getId());
        double pct = total > 0 ? (double) voted / total : 0;

        log.info("Resolving plan id={} title='{}' deadline={} members={} voted={}",
            plan.getId(), plan.getTitle(), plan.getDeadline(), total, voted);

        if (voted > 0 && pct >= QUORUM_PERCENT) {
            // Winner = option with most votes
            List<com.teampulse.domain.Vote> votes = voteRepository.findByPlanId(plan.getId());
            java.util.Map<String, Long> counts = new java.util.HashMap<>();
            for (com.teampulse.domain.Vote v : votes) {
                counts.merge(v.getOptionId(), 1L, Long::sum);
            }
            String winnerId = counts.entrySet().stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey)
                .orElse(null);
            String winnerName = plan.getOptions().stream()
                .filter(o -> o.getId().equals(winnerId))
                .findFirst()
                .map(PlanOption::getName)
                .orElse("Unknown");
            plan.setStatus(Plan.PlanStatus.CONFIRMED);
            plan.setWinnerOptionId(winnerId);
            planRepository.save(plan);
            log.info("Plan id={} CONFIRMED winner='{}'. Sending result emails (with calendar invite) to {} member(s).",
                plan.getId(), winnerName, members.size());
            emailService.sendResultEmails(plan, teamRepository.findById(plan.getTeamId()).orElseThrow(), members, winnerName, true);
        } else {
            plan.setStatus(Plan.PlanStatus.CANCELLED);
            planRepository.save(plan);
            log.info("Plan id={} CANCELLED (voted={}). Sending result emails to {} member(s).",
                plan.getId(), voted, members.size());
            Team team = teamRepository.findById(plan.getTeamId()).orElse(null);
            emailService.sendResultEmails(plan, team != null ? team : new Team(), members, "", false);
        }
    }
}
