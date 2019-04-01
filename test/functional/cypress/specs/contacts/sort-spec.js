const selectors = require('../../selectors')

describe('Contact Collections Sort', () => {
  beforeEach(() => {
    cy.server()
    cy.route('/contacts?*').as('sortResults')
    cy.visit('/contacts?sortby=collectionTest')
    cy.get(selectors.entityList.entities).children().should('have.length', 9)
    cy.get(selectors.entityCollection.collection).should('contain', '9 contacts')
  })

  it('should sort by country AZ', () => {
    cy.get(selectors.entityCollection.sort).select('address_country.name:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=address_country.name:asc')
    })

    cy.get(selectors.entityList.entities).children().should('have.length', 2)
    cy.get(selectors.entityList.firstEntity).should('contain', 'Sort By')
  })

  it('should sort by last name AZ', () => {
    cy.get(selectors.entityCollection.sort).select('last_name:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=last_name:asc')
    })

    cy.get(selectors.entityList.entities).children().should('have.length', 2)
    cy.get(selectors.entityList.firstEntity).should('contain', 'Sort By')
  })

  it('should sort by company name AZ', () => {
    cy.get(selectors.entityCollection.sort).select('company.name:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=company.name:asc')
    })

    cy.get(selectors.entityList.entities).children().should('have.length', 2)
    cy.get(selectors.entityList.firstEntity).should('contain', 'Sort By')
  })

  it('should sort by least recent', () => {
    cy.get(selectors.entityCollection.sort).select('modified_on:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=modified_on:asc')
    })

    cy.get(selectors.entityList.entities).children().should('have.length', 2)
    cy.get(selectors.entityList.firstEntity).should('contain', 'Sort By')
  })

  it('should sort by most recent', () => {
    cy.get(selectors.entityCollection.sort).select('modified_on:desc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=modified_on:desc')
    })

    cy.get(selectors.entityList.entities).children().should('have.length', 2)
    cy.get(selectors.entityList.firstEntity).should('contain', 'Sort By')
  })

  it('should sort by Newest', () => {
    cy.get(selectors.entityCollection.sort).select('created_on:desc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=created_on:desc')
    })

    cy.get(selectors.entityList.entities).children().should('have.length', 2)
    cy.get(selectors.entityList.firstEntity).should('contain', 'Sort By')
  })

  it('should sort by Oldest', () => {
    cy.get(selectors.entityCollection.sort).select('created_on:asc')

    cy.wait('@sortResults').then((xhr) => {
      expect(xhr.url).to.contain('?custom=true&sortby=created_on:asc')
    })

    cy.get(selectors.entityList.entities).children().should('have.length', 2)
    cy.get(selectors.entityList.firstEntity).should('contain', 'Sort By')
  })
})
