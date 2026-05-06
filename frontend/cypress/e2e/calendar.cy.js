describe('Calendar interactiv', () => {
  beforeEach(() => {
    cy.fixture('user').then((user) => {
      cy.visit('/login')
      cy.get('input[type="email"]').type(user.email)
      cy.get('input[type="password"]').type(user.password)
      cy.get('button').contains('Intră în Cont').click()
      cy.url().should('include', '/home')
    })
  })

  it('se deschide modalul la click pe Rezerva', () => {
    cy.get('button').contains('Rezervă').first().click()
    cy.contains('Disponibil').should('be.visible')
    cy.contains('Ocupat').should('be.visible')
    cy.contains('Selectat').should('be.visible')
  })

  it('modalul se inchide la click pe X', () => {
    cy.get('button').contains('Rezervă').first().click()
    cy.get('button').contains('✕').click()
    cy.get('button').contains('🚜 Confirmă rezervarea').should('not.exist')
  })

  it('butonul de confirmare e dezactivat fara interval selectat', () => {
    cy.get('button').contains('Rezervă').first().click()
    cy.get('button').contains('Confirmă rezervarea').should('be.disabled')
  })

  it('zilele din trecut nu pot fi selectate', () => {
    cy.get('button').contains('Rezervă').first().click()
    // Zilele gri (trecut) au culoarea #f5f5f5
    cy.get('[style*="f5f5f5"]').first().click()
    cy.get('button').contains('Confirmă rezervarea').should('be.disabled')
  })

  it('navigarea intre luni functioneaza', () => {
    cy.get('button').contains('Rezervă').first().click()
    cy.get('button').contains('›').click()
    cy.get('button').contains('‹').click()
    cy.contains('mai').should('be.visible')
  })

  it('afiseaza total corect dupa selectia intervalului', () => {
    cy.get('button').contains('Rezervă').first().click()
    // Selectam doua zile disponibile
    cy.get('[style*="e8f5e8"]').eq(0).click()
    cy.get('[style*="e8f5e8"]').eq(2).click()
    cy.contains('Total').should('be.visible')
    cy.contains('lei').should('be.visible')
  })
})