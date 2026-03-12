package com.teampulse.repository;

import com.teampulse.domain.VoterToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface VoterTokenRepository extends MongoRepository<VoterToken, String> {

    Optional<VoterToken> findByPlanIdAndToken(String planId, String token);

    List<VoterToken> findByPlanId(String planId);
}
