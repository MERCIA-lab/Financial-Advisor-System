package com.xod.backend.security;

import com.xod.backend.entity.FinancialAdvisor;
import com.xod.backend.repository.FinancialAdvisorRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdvisorUserDetailsService implements UserDetailsService {
    private final FinancialAdvisorRepository advisorRepository;

    public AdvisorUserDetailsService(FinancialAdvisorRepository advisorRepository) {
        this.advisorRepository = advisorRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        FinancialAdvisor advisor = advisorRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Advisor not found"));

        return new User(
                advisor.getEmail(),
                advisor.getPasswordHash(),
                List.of(new SimpleGrantedAuthority("ROLE_" + advisor.getRole()))
        );
    }
}
