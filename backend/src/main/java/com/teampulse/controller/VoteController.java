package com.teampulse.controller;

import com.teampulse.dto.VoteRequest;
import com.teampulse.service.VoteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/vote")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping("/{planId}")
    public ResponseEntity<Map<String, Object>> castVote(
            @PathVariable String planId,
            @RequestParam String token,
            @Valid @RequestBody VoteRequest request) {
        boolean ok = voteService.castVote(planId, token, request);
        if (!ok) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid token or voting closed"));
        }
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/{planId}/count")
    public ResponseEntity<Map<String, Integer>> getParticipationCount(@PathVariable String planId) {
        return voteService.getParticipationCount(planId)
            .map(c -> ResponseEntity.ok(Map.of("count", c)))
            .orElse(ResponseEntity.notFound().build());
    }
}
