const selectors = require('../../selectors')
const utils = require('../../support/utils')

const serviceDeliveryDetails = selectors.interactionDetails.serviceDelivery

let subject

describe('Add Interaction', () => {
  beforeEach(() => {
    subject = utils.randomString()
  })

  describe('Standard Interaction', () => {
    it('should add interaction by company', () => {
      cy.visit('/companies/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions/create/interaction')
      populateInteractionForm()
      cy.get(selectors.addInteraction.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add interaction by contacts', () => {
      cy.visit('/contacts/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions/create/interaction')
      populateInteractionForm()
      cy.get(selectors.addInteraction.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add interaction by investment projects', () => {
      cy.visit('/investments/projects/5d341b34-1fc8-4638-b4b1-a0922ebf401e/interactions/create/interaction')
      populateInteractionForm()
      cy.get(selectors.addInteraction.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should map values to the successfully created interaction form', () => {
      cy.visit('/companies/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions/create/interaction')
      cy.get(selectors.addInteraction.subject).type(subject)
      cy.get(selectors.addInteraction.add).click()

      validateSuccesfulFormSubmission(subject, 'Interaction created')
    })
  })

  describe('Service delivery', () => {
    it('should add service delivery by company', () => {
      cy.visit('/companies/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions/create/service-delivery')
      populateServiceDeliveryForm('Bank Referral')
      cy.get(selectors.addInteraction.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add service delivery by contacts', () => {
      cy.visit('/contacts/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions/create/service-delivery')
      populateServiceDeliveryForm('Bank Referral')
      cy.get(selectors.addInteraction.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add service delivery by investment projects', () => {
      cy.visit('/investments/projects/5d341b34-1fc8-4638-b4b1-a0922ebf401e/interactions/create/service-delivery')
      populateServiceDeliveryForm('Account Management')
      cy.get(selectors.addInteraction.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add service delivery with TAP service optional fields empty', () => {
      cy.visit('/companies/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions/create/service-delivery')

      cy.get(selectors.addInteraction.contact).select('Joseph Woof, Dog master')
      cy.get(selectors.addInteraction.eventNo).click()
      cy.get(selectors.addInteraction.service).select('Tradeshow Access Programme (TAP)')
      cy.get(selectors.addInteraction.subject).type(subject)
      cy.get(selectors.addInteraction.notes).type('Conversation with potential client')
      cy.get(selectors.addInteraction.policyFeedbackNo).click()
      cy.get(selectors.addInteraction.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add service delivery with TAP service optional fields populated', () => {
      cy.visit('/companies/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions/create/service-delivery')

      cy.get(selectors.addInteraction.contact).select('Joseph Woof, Dog master')
      cy.get(selectors.addInteraction.eventNo).click()
      cy.get(selectors.addInteraction.service).select('Tradeshow Access Programme (TAP)')
      cy.get(selectors.addInteraction.serviceStatus).select('Current')
      cy.get(selectors.addInteraction.grantOffered).type('Approved')
      cy.get(selectors.addInteraction.subject).type(subject)
      cy.get(selectors.addInteraction.notes).type('Conversation with potential client')
      cy.get(selectors.addInteraction.policyFeedbackNo).click()

      cy.get(selectors.addInteraction.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should map values to the successfully created service delivery form', () => {
      cy.visit('/companies/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions/create/service-delivery')
      cy.get(selectors.addInteraction.subject).type(subject)
      cy.get(selectors.addInteraction.add).click()

      validateSuccesfulFormSubmission(subject, 'Service delivery created')
    })
  })
})

const populateInteractionForm = () => {
  cy.get(selectors.addInteraction.contact).select('Joseph Woof, Dog master')
  cy.get(selectors.addInteraction.service).select('Account Management')
  cy.get(selectors.addInteraction.communicationChannel).select('Email/Website')
  cy.get(selectors.addInteraction.subject).type(subject)
  cy.get(selectors.addInteraction.notes).type('Conversation with potential client')
  cy.get(selectors.addInteraction.policyFeedbackNo).click()
}

const populateServiceDeliveryForm = service => {
  cy.get(selectors.addInteraction.contact).select('Joseph Woof, Dog master')
  cy.get(selectors.addInteraction.eventNo).click()
  cy.get(selectors.addInteraction.service).select(service)
  cy.get(selectors.addInteraction.subject).type(subject)
  cy.get(selectors.addInteraction.notes).type('Conversation with potential client')
  cy.get(selectors.addInteraction.policyFeedbackNo).click()
}

const validateSuccesfulFormSubmission = (subject, headerTitle) => {
  cy.get(serviceDeliveryDetails.company).should('contain', 'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978')
  cy.get(serviceDeliveryDetails.contacts).should('contain', 'Bob lawson')
  cy.get(serviceDeliveryDetails.serviceProvider).should('contain', 'UKTI Team East Midlands - International Trade Team')
  cy.get(serviceDeliveryDetails.service).should('contain', 'Account Managment: Northern Powerhouse')
  cy.get(serviceDeliveryDetails.subject).should('contain', subject)
  cy.get(serviceDeliveryDetails.notes).should('contain', 'Sandbox')
  cy.get(serviceDeliveryDetails.dateOfInteraction).should('contain', '7 February 2019')
  cy.get(serviceDeliveryDetails.ditAdviser).should('contain', 'DIT Staff')
  cy.get(serviceDeliveryDetails.communicationChannel).should('contain', 'Social Media')
  cy.get(serviceDeliveryDetails.documents).should('contain', 'There are no files or documents')
  cy.get(serviceDeliveryDetails.successMsg).should('contain', headerTitle)
}
