package com.xod.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio", uniqueConstraints = @UniqueConstraint(columnNames = "client_id"))
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long portfolioId;

    @OneToOne(optional = false)
    @JoinColumn(name = "client_id", nullable = false, unique = true)
    private Client client;

    @Column(nullable = false)
    private LocalDateTime creationDate;

    @PrePersist
    public void onCreate() {
        creationDate = LocalDateTime.now();
    }

    public Portfolio() {
    }

    public Portfolio(Long portfolioId, Client client, LocalDateTime creationDate) {
        this.portfolioId = portfolioId;
        this.client = client;
        this.creationDate = creationDate;
    }

    public Long getPortfolioId() { return portfolioId; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public LocalDateTime getCreationDate() { return creationDate; }
    public void setCreationDate(LocalDateTime creationDate) { this.creationDate = creationDate; }
}
