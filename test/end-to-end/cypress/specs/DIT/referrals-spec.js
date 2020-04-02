const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const formSelectors = selectors.interactionForm

const selectTypeahead = (fieldName, input) =>
  cy.contains(fieldName).within(() => {
    cy.server()
    cy.route('/api-proxy/adviser/?*').as('adviserResults')
    cy.get('div')
      .eq(0)
      .type(input)
    cy.wait('@adviserResults')
    cy.get('[class*="menu"] > div').click()
  })

describe('Referrals', () => {
  before(() => {
    cy.visit(urls.companies.referrals.send(fixtures.company.lambdaPlc.id))
  })
  context('when adding a referral', () => {
    it('should create a referral for a company', () => {
      selectTypeahead('Adviser', 'dennis')
      cy.get(selectors.companySendReferral.subjectField)
        .click()
        .clear()
        .type('Example subject')
        .get(selectors.companySendReferral.notesField)
        .click()
        .type('Example notes')
        .get(selectors.companySendReferral.continueButton)
        .click()
      cy.contains('Check referral details')
        .should('be.visible')
        .parents()
        .find('button')
        .eq(2)
        .click()
      cy.get(selectors.localHeader())
      cy.contains('Referral sent')
    })
  })
  context('when viewing a referral', () => {
    it('should display in the companies activity feed', () => {
      // TODO - currently we cannot view the activity feed, once this is fixed we should add this test
    })

    it('should display the new referral on the homepage', () => {
      cy.get(selectors.localHeader().flash)
        .find('a')
        .eq(0)
        .click()
      cy.get(selectors.tabbedNav().item(2)).click()
      cy.get(selectors.tabbedNav().container)
        .next()
        .find('h3')
        .should('contain', '1 Referral')
        .parent()
        .find('ol li')
        .should('contain', 'Lambda plc')
        .find('h3 a')
        .should('contain', 'Example subject')
        .click()
    })
  })

  context('when accepting a referral', () => {
    it('should create an interaction successfully', () => {
      cy.get('details')
        .next()
        .find('a:first-child')
        .click()
      cy.get(selectors.createInteractionContext.export.theme).click()
      cy.get(selectors.createInteractionContext.export.interaction).click()
      cy.get(selectors.createInteractionContext.button).click()
      cy.get(formSelectors.service).select('Export Win')
      cy.get(formSelectors.contact).select('Dean Cox')
      cy.get(formSelectors.communicationChannel).select('Email/Website')
      cy.get(formSelectors.subject).type('Subject')
      cy.get(formSelectors.notes).type('Conversation with potential client')
      cy.get(formSelectors.policyFeedbackNo).click()
      cy.get(formSelectors.countriesDiscussed.no).click()
      cy.get(selectors.interactionForm.add).click()
    })
    it('should display the referral in the interaction', () => {
      cy.get(selectors.localHeader().flash)
        .should('contain', 'Interaction created and referral accepted')
        .parents()
        .find(selectors.interaction.details.interaction.referralDetails)
        .should('contain', 'This interaction is linked to a referral')
        .parents()
        .find(selectors.interaction.details.interaction.referralDetails)
        .should('contain', 'Example subject')
    })
  })
})