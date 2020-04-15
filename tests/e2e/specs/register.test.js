// https://docs.cypress.io/api/introduction/api.html

describe('Account Registration', () => {
  it('opens the register form', () => {
    cy.visit('/');
    cy.get('.button.btn-show-register').click();
    cy.wait(1000);
    cy.get('#form-register').should('exist');
  });

  it('register form password fields are hiding the text', () => {
    cy.get('input#password').should('have.attr', 'type', 'password');
    cy.get('input#confirmPassword').should('have.attr', 'type', 'password');
  });

  const ts = Date.now();
  const username = `e2e${ts}`;
  const password = '123456';
  const email = `e2e${ts}@cy.com`;

  it('fills the register form', () => {
    cy.get('input#username').type(username).should('have.value', username);
    cy.get('input#password').type(password).should('have.value', password);
    cy.get('input#confirmPassword').type(password).should('have.value', password);
    cy.get('input#email').type(email).should('have.value', email);
    cy.get('input#confirmEmail').type(email).should('have.value', email);
  });

  it('registers the new account', () => {
    cy.get('.button.btn-register').click();
    cy.wait(1000);
    cy.get('.notification').find('.message').should('contain', `Your account "${username}" has been created`);
  });

  it('opens the login form automatically', () => {
    cy.wait(1000);
    cy.get('#form-login').should('exist');
  });

  it('login form password field is hiding the text', () => {
    cy.get('input#password').should('have.attr', 'type', 'password');
  });

  it('fills the login form', () => {
    cy.get('input#username').type(username).should('have.value', username);
    cy.get('input#password').type(password).should('have.value', password);
  });

  it('logs in with the fresh account', () => {
    cy.get('.button.btn-login').click();
    cy.wait(1000);
    cy.get('.notification').find('.message').should('contain', `You have been logged in as "${username}"`);
  });
});
