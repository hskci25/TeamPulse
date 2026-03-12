package com.teampulse.controller;

import com.teampulse.domain.Plan;
import com.teampulse.dto.CreatePlanRequest;
import com.teampulse.dto.PlanResponse;
import com.teampulse.service.PlanService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @PostMapping
    public ResponseEntity<Plan> createPlan(@Valid @RequestBody CreatePlanRequest request, Authentication auth) {
        if (auth != null && auth.getName() != null) {
            request.setCreatedBy(auth.getName());
        }
        Plan plan = planService.createPlan(request);
        return ResponseEntity.ok(plan);
    }

    /** Plans the current user is part of (across all their teams). Requires authentication. */
    @GetMapping("/me")
    public ResponseEntity<List<PlanResponse>> getMyPlans(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(planService.getPlansForMember(auth.getName()));
    }

    @GetMapping("/{planId}")
    public ResponseEntity<PlanResponse> getPlan(@PathVariable String planId) {
        return planService.getPlan(planId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /** Get plan for voting page — requires valid token (passed as query param, validated when voting). */
    @GetMapping("/{planId}/vote")
    public ResponseEntity<PlanResponse> getPlanForVote(@PathVariable String planId, @RequestParam String token) {
        return planService.getPlanByToken(planId, token)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<PlanResponse>> getPlansByTeam(@PathVariable String teamId) {
        List<PlanResponse> plans = planService.getPlansByTeam(teamId);
        return ResponseEntity.ok(plans);
    }
}
