package com.xod.backend.repository;

import com.xod.backend.entity.FinancialAdvisor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FinancialAdvisorRepository extends JpaRepository<FinancialAdvisor, Long> {
    Optional<FinancialAdvisor> findByEmail(String email);
}
