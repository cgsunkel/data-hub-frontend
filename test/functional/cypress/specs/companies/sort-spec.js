const selectors = require('../../selectors')

describe('Company Collections Filter', () => {
  before(() => {
    cy.visit('/companies?sortby=collectionTest')
    cy.get(selectors.entityList.entities).children().should('have.length', 9)
    cy.get(selectors.entityCollection.collection).should('contain', '100,172 companies')
  })

  beforeEach(() => {
    cy.server()
    cy.route('/companies?*').as('sortResults')
  })

  it('should sort by AZ', () => {
    cy.get(selectors.entityCollection.sort).select('Company name: A-Z')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=name:asc')
    })

    cy.get(selectors.entityList.entities).children().should('have.length', 2)
    cy.get(selectors.entityList.firstEntity).should('contain', 'SortByAZ')
  })

  it('should sort by least recent', () => {
    cy.get(selectors.entityCollection.sort).select('Least recently updated')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=modified_on:asc')
    })

    cy.get(selectors.entityList.entities).children().should('have.length', 2)
    cy.get(selectors.entityList.firstEntity).should('contain', 'SortByLeastRecent')
  })

  it('should sort by most recent', () => {
    cy.get(selectors.entityCollection.sort).select('Recently updated')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=modified_on:desc')
    })

    cy.get(selectors.entityList.entities).children().should('have.length', 2)
    cy.get(selectors.entityList.firstEntity).should('contain', 'SortByMostRecent')
  })
})
