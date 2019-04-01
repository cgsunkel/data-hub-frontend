const selectors = require('../../selectors')

describe('Investment Project Collections', () => {
  before(() => {
    cy.visit('/investments/projects')
  })

  it('should display a list of investments', () => {
    cy.get(selectors.entityList.entities).children().should('have.length', 10)
  })

  it('should contain investment badge', () => {
    cy.get(selectors.entityList.firstEntityBadge).should('contain', 'Won')
    cy.get(selectors.entityList.firstEntityBadge).should('contain', 'FDI')
    cy.get(selectors.entityList.firstEntityBadge).should('contain', 'ongoing')
  })

  it('should contain investor and sector', () => {
    cy.get(selectors.entityList.firstEntity)
      .should('contain', 'Venus Ltd')
      .and('contain', 'Renewable Energy : Wind : Onshore')
  })
})
