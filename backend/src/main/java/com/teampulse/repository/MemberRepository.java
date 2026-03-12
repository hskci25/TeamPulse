package com.teampulse.repository;

import com.teampulse.domain.Member;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MemberRepository extends MongoRepository<Member, String> {

    List<Member> findByTeamId(String teamId);

    List<Member> findByEmailIgnoreCase(String email);

    boolean existsByTeamIdAndEmail(String teamId, String email);
}
