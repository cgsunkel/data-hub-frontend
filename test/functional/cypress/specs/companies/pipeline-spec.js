const minimallyMinimal = require('../../../../sandbox/fixtures/v4/company/company-minimally-minimal.json')
const lambdaPlc = require('../../../../sandbox/fixtures/v4/company/company-lambda-plc')
const urls = require('../../../../../src/lib/urls')
const {
  assertFieldRadios,
  assertBreadcrumbs,
  assertFormButtons,
} = require('../../support/assertions')
const selectors = require('../../../../selectors')

describe('Company add to pipeline form', () => {
  context('When a company is not already on the pipeline', () => {
    before(() => {
      cy.visit(urls.companies.pipeline(minimallyMinimal.id))
    })

    it('should render the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [minimallyMinimal.name]: urls.companies.detail(minimallyMinimal.id),
        'Add to your pipeline': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        `Add ${minimallyMinimal.name} to your pipeline`
      )
    })

    it('should render the status radio buttons', () => {
      cy.get('#field-category').then((element) => {
        assertFieldRadios({
          element,
          label: 'Choose a status',
          optionsCount: 3,
        })
      })
    })

    it('should render the form buttons', () => {
      assertFormButtons({
        submitText: 'Add',
        cancelText: 'Cancel',
        cancelLink: urls.companies.detail(minimallyMinimal.id),
      })
    })
  })

  context('When the company is already on the pipeline', () => {
    before(() => {
      cy.visit(urls.companies.pipeline(lambdaPlc.id))
    })

    it('should render the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.route,
        Companies: urls.companies.index(),
        [lambdaPlc.name]: urls.companies.detail(lambdaPlc.id),
        'Add to your pipeline': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        `Add ${lambdaPlc.name} to your pipeline`
      )
    })

    it('should render a message', () => {
      cy.contains(`${lambdaPlc.name} is already in your pipeline`)
    })

    it('should render a link to the company', () => {
      cy.contains(`Go back to ${lambdaPlc.name}`).should(
        'have.attr',
        'href',
        urls.companies.detail(lambdaPlc.id)
      )
    })

    it('should render a link to the dashboard', () => {
      cy.contains('Go to your dashboard').should(
        'have.attr',
        'href',
        urls.dashboard()
      )
    })
  })
})