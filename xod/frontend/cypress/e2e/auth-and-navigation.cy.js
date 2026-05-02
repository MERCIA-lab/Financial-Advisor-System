describe('XOD Financial Advisor System', () => {
  beforeEach(() => {
    // Reset application state before each test
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('should load the login page', () => {
    cy.visit('/');
    cy.contains('XOD Financial Advisor').should('be.visible');
    cy.contains('Client Management System').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.visit('/');

    // Fill in login form
    cy.get('input[name="email"]').type('advisor@xod.local');
    cy.get('input[name="password"]').type('password');

    // Mock successful login API response
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: 'mock-jwt-token',
        user: {
          id: 1,
          name: 'Test Advisor',
          email: 'advisor@xod.local'
        }
      }
    }).as('loginRequest');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for login request and redirect
    cy.wait('@loginRequest');
    cy.url().should('include', '/');
  });

  it('should display dashboard after login', () => {
    // Mock authenticated state
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-jwt-token');
      win.localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test Advisor',
        email: 'advisor@xod.local'
      }));
    });

    // Mock dashboard API calls
    cy.intercept('GET', '**/clients', {
      statusCode: 200,
      body: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ]
    }).as('getClients');

    cy.visit('/');

    // Verify dashboard loads
    cy.contains('Advisor Dashboard').should('be.visible');
    cy.contains('Total AUM').should('be.visible');
    cy.contains('Total Clients').should('be.visible');

    // Wait for API calls to complete
    cy.wait('@getClients');
  });

  it('should navigate between sections', () => {
    // Mock authenticated state
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-jwt-token');
      win.localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test Advisor',
        email: 'advisor@xod.local'
      }));
    });

    cy.visit('/');

    // Test navigation to Clients page
    cy.contains('My Clients').click();
    cy.url().should('include', '/clients');
    cy.contains('My Clients').should('be.visible');
  });

  it('should handle responsive design', () => {
    cy.viewport('iphone-6');
    cy.visit('/');

    // Test mobile layout - hamburger menu should be visible
    cy.get('[aria-label="open drawer"]').should('be.visible');

    cy.viewport('macbook-15');
    // Test desktop layout - sidebar should be visible
    cy.get('[aria-label="open drawer"]').should('not.be.visible');
  });
});