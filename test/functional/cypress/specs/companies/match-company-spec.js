const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const selectors = require('../../../../selectors')
const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertSummaryList,
} = require('../../support/assertions')

const DUNS_NUMBER_NOT_MATCHED = '11111111'
const DUNS_NUMBER_MATCHED = '22222222'

const performSearch = (companyName = 'some company') => {
  cy.get(selectors.companyMatch.find.companyNameInput)
    .clear()
    .type(companyName)
  cy.get(selectors.companyMatch.find.button).click()
}

describe('Match a company', () => {
  context('when viewing "Search for verified business details" page', () => {
    before(() => {
      cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        'Venus Ltd': urls.companies.detail(fixtures.company.venusLtd.id),
        'Search for verified business details': null,
      })
    })

    it('should render the header', () => {
      assertLocalHeader('Search for verified business details')
    })

    it('should render the Data Hub record', () => {
      cy.contains('Data Hub business details (un-verified)')
        .should('have.prop', 'tagName', 'H2')
        .next()
        .find('dl')
        .then(($el) =>
          assertSummaryList($el, {
            'Company name': 'Venus Ltd',
            'Located at': '66 Marcham Road, Bordley, BD23 8RZ, United Kingdom',
          })
        )
    })

    it('should render both search input fields and a button', () => {
      cy.contains('Search third party supplier for business details')
        .and('have.prop', 'tagName', 'H2')
        .next()
        .children()
        .first()
        .should('have.text', 'Company name')
        .find('input')
        .should('have.attr', 'type', 'search')
        .parent()
        .parent()
        .next()
        .should('have.text', 'Company postcode (optional)')
        .find('input')
        .should('have.attr', 'type', 'search')
        .parent()
        .parent()
        .next()
        .contains('Find company')
        .and('have.prop', 'tagName', 'BUTTON')
    })

    it('should prepopulate company name and postcode text fields', () => {
      cy.get(selectors.companyMatch.find.companyNameInput).should(
        'have.attr',
        'value',
        fixtures.company.venusLtd.name
      )
      cy.get(selectors.companyMatch.find.postcodeField).should(
        'have.attr',
        'value',
        fixtures.company.venusLtd.address.postcode
      )
    })
  })

  context(
    'when the "Find company" button is clicked without providing a company name',
    () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
      })

      it('should display error message', () => {
        cy.get(selectors.companyMatch.find.companyNameInput).clear()
        cy.get(selectors.companyMatch.find.button)
          .click()
          .get(selectors.companyMatch.form)
          .contains('Enter company name')
      })

      it('should not display the search results', () => {
        cy.get(selectors.companyMatch.find.results.someCompany).should(
          'not.be.visible'
        )
        cy.get(selectors.companyMatch.find.results.someOtherCompany).should(
          'not.be.visible'
        )
      })
    }
  )

  context(
    'when the "Find company" button is clicked providing a company name',
    () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
        performSearch()
      })

      it('should display the company search results', () => {
        cy.get(selectors.companyMatch.find.results.someCompany).should(
          'be.visible'
        )
        cy.get(selectors.companyMatch.find.results.someOtherCompany).should(
          'be.visible'
        )
      })
    }
  )

  context(`when "I still can't find what I'm looking for" is clicked`, () => {
    before(() => {
      cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
      performSearch()
      cy.contains("I can't find what I'm looking for").click()
      cy.contains("I still can't find what I'm looking for").click()
    })

    it('should redirect to the cannot find match page', () => {
      cy.location('pathname').should(
        'eq',
        urls.companies.match.cannotFind(fixtures.company.venusLtd.id)
      )
    })

    it('should render the header', () => {
      assertLocalHeader("I still can't find what I'm looking for")
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.venusLtd.name]: urls.companies.detail(
          fixtures.company.venusLtd.id
        ),
        'Cannot find details': null,
      })
    })

    it('should display the page content', () => {
      cy.contains(
        'Thanks for trying to verify the business details on this Data Hub record.'
      )
        .parent()
        .next()
        .should('have.text', 'You can continue to use Data Hub as normal.')
        .next()
        .should('match', 'br')
        .next()
        .should('have.text', 'Return to company record')
        .and('match', 'a')
        .and(
          'have.attr',
          'href',
          urls.companies.detail(fixtures.company.venusLtd.id)
        )
    })
  })

  context(
    'when an unmatched company from the search results is clicked',
    () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
        performSearch()
        cy.contains('Some unmatched company').click()
      })

      it('should redirect to the the match confirmation page', () => {
        cy.location('pathname').should(
          'eq',
          urls.companies.match.confirmation(
            fixtures.company.venusLtd.id,
            DUNS_NUMBER_NOT_MATCHED
          )
        )
      })

      it('should render the header', () => {
        assertLocalHeader('Send request for verification')
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          Companies: urls.companies.index(),
          [fixtures.company.venusLtd.name]: urls.companies.detail(
            fixtures.company.venusLtd.id
          ),
          'Send request': null,
        })
      })

      it('should display matching confirmation details', () => {
        cy.contains('Data Hub business details (un-verified)')
          .should('have.prop', 'tagName', 'H2')
          .next()
          .find('dl')
          .then(($el) =>
            assertSummaryList($el, {
              'Company name': 'Venus Ltd',
              'Located at':
                '66 Marcham Road, Bordley, BD23 8RZ, United Kingdom',
            })
          )
          .parent()
          .parent()
          .next()
          .should('have.text', 'Data Hub business details (after verification)')
          .and('have.prop', 'tagName', 'H2')
          .next()
          .find('dl')
          .then(($el) =>
            assertSummaryList($el, {
              'Company name': 'Some unmatched company',
              'Located at': '123 ABC Road, Brighton, BN2 9QB, United Kingdom',
            })
          )
          .parent()
          .parent()
          .next()
          .find('summary')
          .should('have.text', "Why can't I edit these details")
          .next()
          .should(
            'have.text',
            'These business details are from trusted third-party' +
              ' suppliers of verified company records. Being editable would make' +
              " them less reliable. If you think they're wrong, go back and select" +
              ' "I can\'t find what I\'m looking for".'
          )
          .parent()
          .next()
          .should('have.text', 'Requesting verification will:')
          .and('have.prop', 'tagName', 'H2')
          .next()
          .children()
          .should('have.length', 4)
          .first()
          .should(
            'have.text',
            'NOT change any recorded activity (interactions, OMIS orders or Investment projects)'
          )
          .next()
          .should(
            'have.text',
            'send a request to the Support Team to verify the details'
          )
          .next()
          .should(
            'have.text',
            'notify you when the Support Team update this record'
          )
          .next()
          .should(
            'have.text',
            'ensure these business details are updated automatically in the future'
          )
          .parent()
          .next()
          .contains('Request verification')
          .and('have.prop', 'tagName', 'BUTTON')
          .next()
          .contains('Back')
          .should(
            'have.attr',
            'href',
            urls.companies.match.index(fixtures.company.venusLtd.id)
          )
      })
    }
  )

  context('when company matching is confirmed', () => {
    before(() => {
      cy.visit(
        urls.companies.match.confirmation(
          fixtures.company.venusLtd.id,
          DUNS_NUMBER_NOT_MATCHED
        )
      )
      cy.contains('Request verification').click()
    })

    it('should redirect to the company page', () => {
      cy.location('pathname').should(
        'eq',
        urls.companies.activity.index(fixtures.company.venusLtd.id)
      )
    })

    it('displays the "Company record update request sent" flash message', () => {
      cy.get(selectors.localHeader().flash).should(
        'contain.text',
        'Verification requested. Some business details may be wrong.' +
          'Once verified, the warning message will disappear.'
      )
    })
  })

  context(
    'when an already matched company from the search results is clicked',
    () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
        performSearch()
        cy.contains('Some matched company').click()
      })

      it('should redirect to the the duplicated match page', () => {
        cy.location('pathname').should(
          'eq',
          urls.companies.match.confirmation(
            fixtures.company.venusLtd.id,
            DUNS_NUMBER_MATCHED
          )
        )
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          Companies: urls.companies.index(),
          [fixtures.company.venusLtd.name]: urls.companies.detail(
            fixtures.company.venusLtd.id
          ),
          'Request merge': null,
        })
      })

      it('should render the header', () => {
        assertLocalHeader(
          'These verified business details have already been matched to another company record'
        )
      })

      it('should display the content of the duplicate match page', () => {
        cy.contains(
          'This can happen when there are duplicate company records in Data Hub. To resolve this, you can ask the Support Team to merge these duplicates into one record.'
        )
          .next()
          .should(
            'have.text',
            'You can copy and paste the following instructions in the Description field of the form:'
          )
          .next()
          .contains('Company records merge request')
          .parent()
          .next()
          .should(
            'have.text',
            'Please merge company record Venus Ltd' +
              ' (0f5216e0-849f-11e6-ae22-56b6b6499611)' +
              ' with company record Some matched company' +
              ' (0fb3379c-341c-4da4-b825-bf8d47b26baa).'
          )
          .parent()
          .next()
          .contains('Request merge')
          .and('match', 'a')
          .should('have.attr', 'href', urls.support())
          .next()
          .contains('Back to search results')
          .should(
            'have.attr',
            'href',
            urls.companies.match.index(fixtures.company.venusLtd.id)
          )
      })
    }
  )
})
