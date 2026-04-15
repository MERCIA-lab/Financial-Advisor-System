CREATE TABLE financial_advisor (
    advisor_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE client (
    client_id BIGSERIAL PRIMARY KEY,
    advisor_id BIGINT NOT NULL REFERENCES financial_advisor(advisor_id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE portfolio (
    portfolio_id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL UNIQUE REFERENCES client(client_id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE security (
    security_id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT NOT NULL REFERENCES portfolio(portfolio_id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    purchase_date DATE NOT NULL,
    purchase_price NUMERIC(19,4) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_client_advisor_id ON client(advisor_id);
CREATE INDEX idx_portfolio_client_id ON portfolio(client_id);
CREATE INDEX idx_security_portfolio_id ON security(portfolio_id);

INSERT INTO financial_advisor (name, email, phone, password_hash, role, created_at, updated_at)
VALUES ('Default Advisor', 'advisor@xod.local', '555-0100', '$2a$10$7EqJtq98hPqEX7fNZaFWoOHi8wQ9Q0jrISFRCGDpa2BkLomqKgJo6', 'ADVISOR', NOW(), NOW());
