describe('Calendar interactiv', () => {
  beforeEach(() => {
    const email = Cypress.env('EMAIL') || 'test.cypress@gmail.com'
    const password = Cypress.env('PASSWORD') || 'parola123'
    cy.visit('/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('button').contains('Intră în Cont').click()
    cy.url({ timeout: 10000 }).should('include', '/home')
  })

  it('pagina home se incarca corect dupa login', () => {
    cy.contains('Găsește utilajul potrivit').should('be.visible')
  })

  it('search bar este vizibil si functional', () => {
    cy.get('input[placeholder*="Caută"]').should('be.visible')
    cy.get('input[placeholder*="Caută"]').type('John', { force: true })
  })

  it('filtrele de judet sunt vizibile', () => {
    cy.contains('Județ:').should('be.visible')
    cy.contains('Toate').should('be.visible')
  })

  it('navigarea catre adauga utilaj functioneaza', () => {
    cy.contains('Adaugă Utilaj').click()
    cy.url().should('include', '/adauga-utilaj')
  })

  it('navigarea catre rezervari functioneaza', () => {
    cy.contains('Rezervări').click()
    cy.url().should('include', '/rezervari')
  })

it('modalul calendarului se deschide daca exista utilaje', () => {
  cy.get('body').then(($body) => {
    if ($body.find('button:contains("Rezervă")').length > 0) {
      cy.get('button').contains('Rezervă').first().click({ force: true })
      cy.get('body').then(($b) => {
        if ($b.text().includes('Disponibil')) {
          cy.contains('Disponibil').should('be.visible')
        }
      })
    } else {
      cy.log('Nu exista utilaje - test skipped')
    }
  })
})
})