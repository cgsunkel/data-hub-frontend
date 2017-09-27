const faker = require('faker')
const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const ContactList = client.page.ContactList()
  const AuditContact = client.page.AuditContact()
  const InvestmentStage = client.page.InvestmentStage()
  const foreignCompanyName = 'Lambda Plc'
  let contactName
  let telephone
  let countryCode

  Given(/^I Amend (.*) records of an existing contact record$/, async (number) => {
    telephone = faker.phone.phoneNumber()
    countryCode = faker.random.number()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await ContactList
      .click('@contactsTab')
    await Contact
      .getText('@firstCompanyFromList', (result) => {
        contactName = result.value
      })
      .click('@firstCompanyFromList')
    await AuditContact
      .editContactDetails(telephone, countryCode, number)
  })

  When(/^I search for this Contact record$/, async () => {
    await Company
      .navigate()
      .findCompany(contactName)
    await ContactList
      .click('@contactsTab')
    await Contact
      .click('@firstCompanyFromList')
  })

  When(/^I navigate to Audit History tab$/, async () => {
    await AuditContact
      .click('@auditHistoryTab')
  })

  Then(/^I see the name of the person who made the recent contact record changes$/, async () => {
    await AuditContact
      .verify.containsText('@advisorNameFromList', 'Test CMU 1')
  })

  Then(/^I see the date time stamp when the recent contact record changed$/, async () => {
    const datetime = format(new Date(), 'D MMM YYYY')
    await AuditContact
      .verify.containsText('@createdDateFromFirstList', datetime)
  })

  Then(/^I see the total number of changes occurred recently on this contact record$/, async () => {
    await AuditContact
      .verify.containsText('@changedItemsCount', '2 changes')
  })

  Then(/^I see the field names that were recently changed$/, async () => {
    await AuditContact
      .verify.containsText('@fieldNameFromList', 'Phone number')
  })

  Given(/^I archive an existing contact record$/, async () => {
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await ContactList
      .click('@contactsTab')
    await AuditContact
      .getText('@lastContactFromList', (result) => {
        contactName = result.value
      })
      .click('@lastContactFromList')
    await InvestmentStage
      .click('@archiveButton')
    await AuditContact
      .click('@archiveReason')
      .submitForm('form')
      .assert.containsText('@flashInfo', 'Contact record updated')
  })

  When(/^I archive this contact record$/, async () => {
    await InvestmentStage
      .click('@archiveButton')
    await AuditContact
      .click('@archiveReason')
      .submitForm('form')
      .assert.containsText('@flashInfo', 'Contact record updated')
  })

  When(/^I unarchive this contact record$/, async () => {
    await AuditContact
      .click('@unarchiveAnContactButton')
      .assert.containsText('@flashInfo', 'Contact record updated')
  })

  Then(/^I see the details who archived the contact$/, async () => {
    await AuditContact
      .verify.containsText('@advisorNameFromList', 'Test CMU 1')
  })

  Then(/^I see the details who unarchived the contact$/, async () => {
    await AuditContact
      .verify.containsText('@advisorNameFromList', 'Test CMU 1')
  })
})
