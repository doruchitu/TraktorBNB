describe('Validare formulare Auth', () => {

  // ─── SIGNUP ───
  describe('Signup', () => {
    beforeEach(() => {
      cy.visit('/signup')
    })

    it('afiseaza eroare pentru parole diferite', () => {
      cy.get('input[placeholder="Nume"]').type('Ion')
      cy.get('input[placeholder="Prenume"]').type('Pop')
      cy.get('input[type="email"]').type('ion@test.com')
      cy.get('input[type="tel"]').type('0712345678')
      cy.get('input[placeholder*="minim"]').type('parola123')
      cy.get('input[placeholder*="Confirmă"]').type('altaparola')
      cy.get('button').contains('Creează Cont').click()
      cy.contains('Parolele nu coincid').should('be.visible')
    })

    it('afiseaza eroare pentru parola prea scurta', () => {
      cy.get('input[placeholder="Nume"]').type('Ion')
      cy.get('input[placeholder="Prenume"]').type('Pop')
      cy.get('input[type="email"]').type('ion@test.com')
      cy.get('input[type="tel"]').type('0712345678')
      cy.get('input[placeholder*="minim"]').type('123')
      cy.get('input[placeholder*="Confirmă"]').type('123')
      cy.get('button').contains('Creează Cont').click()
      cy.contains('minim 6 caractere').should('be.visible')
    })

    it('afiseaza eroare pentru telefon invalid', () => {
      cy.get('input[placeholder="Nume"]').type('Ion')
      cy.get('input[placeholder="Prenume"]').type('Pop')
      cy.get('input[type="email"]').type('ion@test.com')
      cy.get('input[type="tel"]').type('123')
      cy.get('input[placeholder*="minim"]').type('parola123')
      cy.get('input[placeholder*="Confirmă"]').type('parola123')
      cy.get('button').contains('Creează Cont').click()
      cy.contains('telefon invalid').should('be.visible')
    })

    it('afiseaza eroare daca lipsesc numele si prenumele', () => {
      cy.get('input[type="email"]').type('ion@test.com')
      cy.get('input[type="tel"]').type('0712345678')
      cy.get('input[placeholder*="minim"]').type('parola123')
      cy.get('input[placeholder*="Confirmă"]').type('parola123')
      cy.get('button').contains('Creează Cont').click()
      cy.contains('obligatorii').should('be.visible')
    })
  })

  // ─── LOGIN ───
  describe('Login', () => {
    beforeEach(() => {
      cy.visit('/login')
    })

    it('afiseaza eroare pentru credentiale gresite', () => {
      cy.get('input[type="email"]').type('gresit@test.com')
      cy.get('input[type="password"]').type('parolagresite')
      cy.get('button').contains('Intră în Cont').click()
      cy.contains('incorectă').should('be.visible')
    })

    it('redirect catre home dupa login reusit', () => {
      cy.fixture('user').then((user) => {
        cy.get('input[type="email"]').type(user.email)
        cy.get('input[type="password"]').type(user.password)
        cy.get('button').contains('Intră în Cont').click()
        cy.url().should('include', '/home')
      })
    })

    it('butonul este dezactivat in timpul loginului', () => {
      cy.get('input[type="email"]').type('test@test.com')
      cy.get('input[type="password"]').type('parola123')
      cy.get('button').contains('Intră în Cont').click()
      cy.get('button').should('be.disabled')
    })
  })
})