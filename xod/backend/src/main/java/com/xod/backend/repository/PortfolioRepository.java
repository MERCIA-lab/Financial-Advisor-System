package com.xod.backend.repository;

import com.xod.backend.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    Optional<Portfolio> findByClientClientId(Long clientId);
    Optional<Portfolio> findByClientClientIdAndClientAdvisorAdvisorId(Long clientId, Long advisorId);
}
