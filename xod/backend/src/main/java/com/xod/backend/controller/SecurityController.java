package com.xod.backend.controller;    //Enabling 2FA (Two Factor Authentifications for End Users!)

import com.xod.backend.dto.SecurityRequest;
import com.xod.backend.entity.Security;
import com.xod.backend.service.SecurityService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class SecurityController {
    private final SecurityService securityService;

    public SecurityController(SecurityService securityService) {
        this.securityService = securityService;
    }

    @GetMapping("/{clientId}/securities")
    public List<Security> list(@PathVariable Long clientId, Authentication authentication) {
        return securityService.listByClient(clientId, authentication.getName());
    }

    @PostMapping("/{clientId}/securities")
    public Security create(@PathVariable Long clientId, @Valid @RequestBody SecurityRequest request, Authentication authentication) {
        return securityService.create(clientId, authentication.getName(), request);
    }

    @PutMapping("/securities/{securityId}")
    public Security update(@PathVariable Long securityId, @Valid @RequestBody SecurityRequest request, Authentication authentication) {
        return securityService.update(securityId, authentication.getName(), request);
    }

    @DeleteMapping("/securities/{securityId}")
    public void delete(@PathVariable Long securityId, Authentication authentication) {
        securityService.delete(securityId, authentication.getName());
    }
}
