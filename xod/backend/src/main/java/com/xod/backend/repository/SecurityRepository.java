package com.xod.backend.repository;

import com.xod.backend.entity.Security;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SecurityRepository extends JpaRepository<Security, Long> {
    List<Security> findByPortfolioPortfolioId(Long portfolioId);
    void deleteByPortfolioPortfolioId(Long portfolioId);
    Optional<Security> findBySecurityIdAndPortfolioClientAdvisorAdvisorId(Long securityId, Long advisorId);
}
