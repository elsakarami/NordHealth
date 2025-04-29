describe('Signup Flow', () => {
  const baseUrl = process.env.PUBLIC_BASE_URL || 'http://192.168.2.102:3000/';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('allows a user to sign up successfully and saves localStorage', () => {
    cy.get('[data-cy="email"]').shadow().find('input').type('nord@gmail.com');
    cy.get('[data-cy="password"]').shadow().find('input').type('StrongPass@123');
    cy.get('[data-cy="terms"]').shadow().find('input').check();
    cy.get('[data-cy="register"]').shadow().find('button').click();
    cy.wait(1000);

    cy.window().then((win) => {
      const token = win.localStorage.getItem('auth_token');
      assert.exists(token, 'Token should exist in localStorage');

      // Save localStorage into fixture
      const snapshot = { ...win.localStorage };
      cy.writeFile('cypress/fixtures/localStorage.json', snapshot);
    });

    cy.url({ timeout: 1000 }).should('include', '/breweries');
  });
});
