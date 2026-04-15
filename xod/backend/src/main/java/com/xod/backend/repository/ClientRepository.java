package com.xod.backend.repository;

import com.xod.backend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByAdvisorAdvisorId(Long advisorId);
    Optional<Client> findByClientIdAndAdvisorAdvisorId(Long clientId, Long advisorId);
}
