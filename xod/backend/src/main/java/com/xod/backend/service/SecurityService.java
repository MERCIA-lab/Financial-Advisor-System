package com.xod.backend.service;

import com.xod.backend.dto.SecurityRequest;
import com.xod.backend.entity.FinancialAdvisor;
import com.xod.backend.entity.Portfolio;
import com.xod.backend.entity.Security;
import com.xod.backend.repository.FinancialAdvisorRepository;
import com.xod.backend.repository.PortfolioRepository;
import com.xod.backend.repository.SecurityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SecurityService {
    private final SecurityRepository securityRepository;
    private final PortfolioRepository portfolioRepository;
    private final FinancialAdvisorRepository advisorRepository;

    public SecurityService(SecurityRepository securityRepository,
                           PortfolioRepository portfolioRepository,
                           FinancialAdvisorRepository advisorRepository) {
        this.securityRepository = securityRepository;
        this.portfolioRepository = portfolioRepository;
        this.advisorRepository = advisorRepository;
    }

    public List<Security> listByClient(Long clientId, String email) {
        FinancialAdvisor advisor = getAdvisorByEmail(email);
        Portfolio portfolio = portfolioRepository.findByClientClientIdAndClientAdvisorAdvisorId(clientId, advisor.getAdvisorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));
        return securityRepository.findByPortfolioPortfolioId(portfolio.getPortfolioId());
    }

    public Security create(Long clientId, String email, SecurityRequest request) {
        FinancialAdvisor advisor = getAdvisorByEmail(email);
        Portfolio portfolio = portfolioRepository.findByClientClientIdAndClientAdvisorAdvisorId(clientId, advisor.getAdvisorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));

        Security security = new Security();
        security.setPortfolio(portfolio);
        security.setName(request.name());
        security.setCategory(request.category());
        security.setPurchaseDate(request.purchaseDate());
        security.setPurchasePrice(request.purchasePrice());
        security.setQuantity(request.quantity());

        return securityRepository.save(security);
    }

    public Security update(Long securityId, String email, SecurityRequest request) {
        FinancialAdvisor advisor = getAdvisorByEmail(email);
        Security security = securityRepository.findBySecurityIdAndPortfolioClientAdvisorAdvisorId(securityId, advisor.getAdvisorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Security not found"));

        security.setName(request.name());
        security.setCategory(request.category());
        security.setPurchaseDate(request.purchaseDate());
        security.setPurchasePrice(request.purchasePrice());
        security.setQuantity(request.quantity());

        return securityRepository.save(security);
    }

    public void delete(Long securityId, String email) {
        FinancialAdvisor advisor = getAdvisorByEmail(email);
        Security security = securityRepository.findBySecurityIdAndPortfolioClientAdvisorAdvisorId(securityId, advisor.getAdvisorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Security not found"));
        securityRepository.delete(security);
    }

    private FinancialAdvisor getAdvisorByEmail(String email) {
        return advisorRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Advisor not found"));
    }
}
