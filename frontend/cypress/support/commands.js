Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button').contains('Intră în Cont').click()
  cy.url({ timeout: 10000 }).should('include', '/home') // ← timeout mai mare
})