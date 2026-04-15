package com.xod.backend.service;

import com.xod.backend.dto.ClientRequest;
import com.xod.backend.entity.Client;
import com.xod.backend.entity.FinancialAdvisor;
import com.xod.backend.entity.Portfolio;
import com.xod.backend.repository.ClientRepository;
import com.xod.backend.repository.FinancialAdvisorRepository;
import com.xod.backend.repository.PortfolioRepository;
import com.xod.backend.repository.SecurityRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ClientService {
    private final ClientRepository clientRepository;
    private final FinancialAdvisorRepository advisorRepository;
    private final PortfolioRepository portfolioRepository;
    private final SecurityRepository securityRepository;

    public ClientService(ClientRepository clientRepository,
                         FinancialAdvisorRepository advisorRepository,
                         PortfolioRepository portfolioRepository,
                         SecurityRepository securityRepository) {
        this.clientRepository = clientRepository;
        this.advisorRepository = advisorRepository;
        this.portfolioRepository = portfolioRepository;
        this.securityRepository = securityRepository;
    }

    public List<Client> listByAdvisorEmail(String email) {
        FinancialAdvisor advisor = getAdvisorByEmail(email);
        return clientRepository.findByAdvisorAdvisorId(advisor.getAdvisorId());
    }

    @Transactional
    public Client create(String email, ClientRequest request) {
        FinancialAdvisor advisor = getAdvisorByEmail(email);

        Client client = new Client();
        client.setAdvisor(advisor);
        client.setFirstName(request.firstName());
        client.setLastName(request.lastName());
        client.setAddress(request.address());
        client.setEmail(request.email());
        client.setPhone(request.phone());

        Client saved = clientRepository.save(client);

        Portfolio portfolio = new Portfolio();
        portfolio.setClient(saved);
        portfolioRepository.save(portfolio);

        return saved;
    }

    public Client update(Long clientId, String email, ClientRequest request) {
        FinancialAdvisor advisor = getAdvisorByEmail(email);
        Client client = clientRepository.findByClientIdAndAdvisorAdvisorId(clientId, advisor.getAdvisorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));
        client.setFirstName(request.firstName());
        client.setLastName(request.lastName());
        client.setAddress(request.address());
        client.setEmail(request.email());
        client.setPhone(request.phone());
        return clientRepository.save(client);
    }

    @Transactional
    public void delete(Long clientId, String email) {
        FinancialAdvisor advisor = getAdvisorByEmail(email);
        Client client = clientRepository.findByClientIdAndAdvisorAdvisorId(clientId, advisor.getAdvisorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        Portfolio portfolio = portfolioRepository.findByClientClientId(client.getClientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));
        securityRepository.deleteByPortfolioPortfolioId(portfolio.getPortfolioId());
        portfolioRepository.delete(portfolio);
        clientRepository.delete(client);
    }

    private FinancialAdvisor getAdvisorByEmail(String email) {
        return advisorRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Advisor not found"));
    }
}
