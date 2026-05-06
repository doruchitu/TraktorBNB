describe('Contract PDF', () => {
  beforeEach(() => {
    cy.fixture('user').then((user) => {
      cy.visit('/login')
      cy.get('input[type="email"]').type(user.email)
      cy.get('input[type="password"]').type(user.password)
      cy.get('button').contains('Intră în Cont').click()
      cy.url().should('include', '/home')
      cy.visit('/rezervari')
    })
  })

  it('pagina de rezervari se incarca corect', () => {
    cy.contains('Rezervările mele').should('be.visible')
    cy.contains('Cereri primite').should('be.visible')
  })

it('butonul de descarcare apare doar pentru rezervari aprobate', () => {
  cy.get('body').then(($body) => {
    if ($body.text().includes('În așteptare')) {
      cy.contains('În așteptare').parent().parent()
        .find('button').contains('Descarcă contract')
        .should('not.exist')
    } else {
      cy.log('Nu exista rezervari pending pentru acest test')
    }
  })
})

  it('butonul de descarcare contract este vizibil pentru rezervari aprobate', () => {
    cy.get('body').then(($body) => {
      if ($body.text().includes('Aprobat')) {
        cy.contains('Aprobat').parent().parent()
          .find('button').contains('Descarcă contract')
          .should('be.visible')
      } else {
        cy.log('Nu exista rezervari aprobate pentru acest test')
      }
    })
  })

  it('click pe descarcare contract initiaza downloadul', () => {
    cy.get('body').then(($body) => {
      if ($body.text().includes('Aprobat')) {
        cy.window().then((win) => {
          cy.stub(win.URL, 'createObjectURL').returns('blob:test')
        })
        cy.contains('Descarcă contract').click()
        cy.readFile('cypress/downloads/contract_TBN_0001.pdf')
          .should('exist')
      } else {
        cy.log('Nu exista rezervari aprobate pentru acest test')
      }
    })
  })

  it('tab-ul cereri primite functioneaza', () => {
    cy.contains('Cereri primite').click()
    cy.contains('Cereri primite').should('be.visible')
  })
})