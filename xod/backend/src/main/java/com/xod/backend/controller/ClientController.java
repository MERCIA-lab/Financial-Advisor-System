package com.xod.backend.controller;

import com.xod.backend.dto.ClientRequest;
import com.xod.backend.entity.Client;
import com.xod.backend.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public List<Client> list(Authentication authentication) {
        return clientService.listByAdvisorEmail(authentication.getName());
    }

    @PostMapping
    public Client create(@Valid @RequestBody ClientRequest request, Authentication authentication) {
        return clientService.create(authentication.getName(), request);
    }

    @PutMapping("/{clientId}")
    public Client update(@PathVariable Long clientId, @Valid @RequestBody ClientRequest request, Authentication authentication) {
        return clientService.update(clientId, authentication.getName(), request);
    }

    @DeleteMapping("/{clientId}")
    public void delete(@PathVariable Long clientId, Authentication authentication) {
        clientService.delete(clientId, authentication.getName());
    }
}
