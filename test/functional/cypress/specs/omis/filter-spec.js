const selectors = require('../../../../selectors')

describe('OMIS Collections Filter', () => {
  before(() => {
    cy.visit('/omis')
  })

  beforeEach(() => {
    cy.server()
    cy.route('/omis?*').as('filterResults')
  })

  it('should filter by region', () => {
    const ukRegion = selectors.filter.ukRegion
    const { typeahead } = selectors.filter
    cy.get(typeahead(ukRegion).selectedOption)
      .click()
      .get(typeahead(ukRegion).textInput)
      .type('North West')
      .get(typeahead(ukRegion).options)

    cy.get(typeahead(ukRegion).selectedOption).type('{enter}').type('{esc}')

    cy.wait('@filterResults').then(() => {
      cy.get('article header').within(() => {
        cy.contains('1 order')
        cy.contains('North West')
      })
      cy.get('article ol').should('have.length', 1)
    })
  })

  it('should filter by country', () => {
    const country = selectors.filter.omis.country
    const { typeahead } = selectors.filter

    cy.get(typeahead(country).selectedOption)
      .click()
      .get(typeahead(country).textInput)
      .type('United Kingdom')
      .get(typeahead(country).options)
      .should('have.length', 1)
      .get(typeahead(country).textInput)
      .type('{enter}')
      .type('{esc}')

    cy.wait('@filterResults').then((xhr) => {
      expect(xhr.url).to.contain(
        'primary_market=80756b9a-5d95-e211-a939-e4115bead28a'
      )
    })
  })
})
