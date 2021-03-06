const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const addOrReplaceTestCase = ({
  headline,
  option,
  successMessage,
  replace,
}) => {
  it(`should be able to ${replace ? 'replace' : 'add'} an adviser`, () => {
    cy.visit(urls.companies.detail(fixtures.company.lambdaPlc.id))
    cy.get(selectors.tabbedLocalNav().item(3)).click()
    cy.get('#lead-advisers a')
      .contains(`${replace ? 'Replace Lead ITA' : 'Add a Lead ITA'}`)
      .click()
    cy.get('h1').contains(headline)
    cy.get('form label')
      .next()
      .next()
      .selectTypeaheadOption(option)
      .parents('form')
      .find('button')
      .click()
    cy.get(selectors.companyLocalHeader().flashMessageList).contains(
      successMessage
    )
  })
}

describe('Manage Lead ITA', () => {
  addOrReplaceTestCase({
    headline: 'Add someone as the Lead ITA',
    option: 'Harold',
    successMessage:
      "Lead adviser information updated.Send Harold Jones an email to let them know they've been made Lead ITA.",
    replace: false,
  })
  addOrReplaceTestCase({
    headline: 'Replace the Lead ITA',
    option: 'Sarah',
    successMessage:
      "Lead adviser information updated.Send Sarah Gates an email to let them know they've been made Lead ITA.",
    replace: true,
  })
  it('should be able to remove an adviser', () => {
    cy.visit(urls.companies.detail(fixtures.company.lambdaPlc.id))
    cy.get(selectors.tabbedLocalNav().item(3)).click()
    cy.get('#lead-advisers a + a').click()
    cy.get('form button').click()
    cy.get(selectors.companyLocalHeader().flashMessageList).contains(
      'Lead adviser information updated'
    )
  })
})
