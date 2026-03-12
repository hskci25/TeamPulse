package com.teampulse.repository;

import com.teampulse.domain.Plan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface PlanRepository extends MongoRepository<Plan, String> {

    List<Plan> findByTeamId(String teamId);

    List<Plan> findByStatusAndDeadlineBefore(Plan.PlanStatus status, Instant deadline);
}
