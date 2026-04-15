package com.xod.backend.service;

import com.xod.backend.dto.AuthResponse;
import com.xod.backend.dto.LoginRequest;
import com.xod.backend.entity.FinancialAdvisor;
import com.xod.backend.repository.FinancialAdvisorRepository;
import com.xod.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final FinancialAdvisorRepository advisorRepository;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService,
                       FinancialAdvisorRepository advisorRepository,
                       JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.advisorRepository = advisorRepository;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.email());
        String token = jwtService.generateToken(userDetails);
        FinancialAdvisor advisor = advisorRepository.findByEmail(request.email()).orElseThrow();

        String advisorName = advisor.getFirstName() + " " + advisor.getLastName();
        return new AuthResponse(token, advisor.getAdvisorId(), advisorName, advisor.getEmail());
    }
}
