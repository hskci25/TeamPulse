package com.teampulse.repository;

import com.teampulse.domain.Vote;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends MongoRepository<Vote, String> {

    List<Vote> findByPlanId(String planId);

    Optional<Vote> findByPlanIdAndVoterToken(String planId, String voterToken);

    long countByPlanId(String planId);
}
