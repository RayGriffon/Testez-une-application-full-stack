describe('Register spec', () => {
    beforeEach(() => {
      cy.visit('/register');
    });
  
    it('should display register form', () => {
      cy.get('form').should('be.visible');
    });
  
    it('should display an error when register form fails', () => {
      cy.get('input[formControlName=firstName]').type("John");
      cy.get('input[formControlName=lastName]').type("Doe");
      cy.get('input[formControlName=email]').type("jd@gmail.fr");
      cy.get('input[formControlName=password]').type("12{enter}{enter}");
      cy.get('.error').should('contain', 'An error occurred');
    });
  
    it('should register successfully', () => {
      cy.intercept('POST', '/api/auth/register', {
        body: {
          message: "User registered successfully!"
        }
      });
  
      cy.intercept('POST', '/api/auth/login', {
        body: {
          id: 1,
          username: 'John',
          firstName: 'John',
          lastName: 'Doe',
          admin: true
        }
      });
  
      cy.get('input[formControlName=firstName]').type("John");
      cy.get('input[formControlName=lastName]').type("Doe");
      cy.get('input[formControlName=email]').type("jd@gmail.fr");
      cy.get('input[formControlName=password]').type("mdptest123!{enter}{enter}");
      cy.url().should('include', '/login');
    });
  });