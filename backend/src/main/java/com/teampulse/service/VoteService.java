package com.teampulse.service;

import com.teampulse.domain.Plan;
import com.teampulse.domain.Vote;
import com.teampulse.domain.VoterToken;
import com.teampulse.dto.VoteRequest;
import com.teampulse.repository.PlanRepository;
import com.teampulse.repository.VoteRepository;
import com.teampulse.repository.VoterTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class VoteService {

    private final VoteRepository voteRepository;
    private final VoterTokenRepository voterTokenRepository;
    private final PlanRepository planRepository;

    public VoteService(VoteRepository voteRepository, VoterTokenRepository voterTokenRepository,
                       PlanRepository planRepository) {
        this.voteRepository = voteRepository;
        this.voterTokenRepository = voterTokenRepository;
        this.planRepository = planRepository;
    }

    /** Cast or update vote. Token identifies the voter (anonymous). Voting is closed once the plan deadline has passed or plan is no longer PENDING. */
    @Transactional
    public boolean castVote(String planId, String token, VoteRequest req) {
        Optional<VoterToken> vtOpt = voterTokenRepository.findByPlanIdAndToken(planId, token);
        if (vtOpt.isEmpty()) return false;
        Optional<Plan> planOpt = planRepository.findById(planId);
        if (planOpt.isEmpty()) return false;
        Plan plan = planOpt.get();
        if (plan.getStatus() != Plan.PlanStatus.PENDING) return false;
        if (plan.getDeadline() != null && Instant.now().isAfter(plan.getDeadline())) return false;

        Optional<Vote> existing = voteRepository.findByPlanIdAndVoterToken(planId, token);
        Vote vote;
        if (existing.isPresent()) {
            vote = existing.get();
            vote.setOptionId(req.getOptionId());
            vote.setCastAt(Instant.now());
        } else {
            vote = new Vote();
            vote.setPlanId(planId);
            vote.setVoterToken(token);
            vote.setOptionId(req.getOptionId());
            vote.setCastAt(Instant.now());
        }
        voteRepository.save(vote);
        return true;
    }

    public Optional<Integer> getParticipationCount(String planId) {
        return planRepository.findById(planId).isEmpty() ? Optional.empty()
            : Optional.of((int) voteRepository.countByPlanId(planId));
    }
}
