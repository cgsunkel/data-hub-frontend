const {
  getSelectorForElementWithText,
  getButtonWithText,
} = require('../../helpers/selectors')

const getSearchResultsTabSelector = (text) =>
  getSelectorForElementWithText(text, {
    el: '//ul//li',
    className: 'c-entity-search__aggregations-item',
  })

const getSelectorForResultWithText = (text) =>
  getSelectorForElementWithText(text, {
    el: '//a',
    className: 'c-entity__link',
  })

const getSearchResultSelector = (text) =>
  getSelectorForElementWithText(text, {
    el: '//span',
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  })

module.exports = {
  url: process.env.QA_HOST,
  props: {},
  elements: {
    term: '#field-term',
    resultsCount: '.c-collection__result-count',
    addCompanyButton: getButtonWithText('Add company'),
  },
  commands: [
    {
      search(term) {
        return this.waitForElementPresent('@term')
          .setValue('@term', term)
          .sendKeys('@term', [this.api.Keys.ENTER])
          .waitForElementVisible('@resultsCount') // wait for xhr
      },
    },
  ],
  sections: {
    tabs: {
      selector: '.c-entity-search__aggregations',
      commands: [
        {
          getSearchResultsTabSelector,
        },
      ],
      elements: {
        company: getSearchResultsTabSelector('Companies'),
        contact: getSearchResultsTabSelector('Contacts'),
        event: getSearchResultsTabSelector('Events'),
        interaction: getSearchResultsTabSelector('Interactions'),
        investmentProject: getSearchResultsTabSelector('Investment projects'),
        order: getSearchResultsTabSelector('Orders'),
      },
    },
    firstEventSearchResult: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
        eventType: getSearchResultSelector('Type'),
        country: getSearchResultSelector('Country'),
        eventStart: getSearchResultSelector('Begins'),
        eventEnd: getSearchResultSelector('Ends'),
        organiser: getSearchResultSelector('Organiser'),
        leadTeam: getSearchResultSelector('Lead team'),
      },
    },
    firstCompanySearchResult: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
        sector: getSearchResultSelector('Sector'),
        address: getSearchResultSelector('Address'),
        tradingNames: getSearchResultSelector('Trading name'),
      },
    },
    firstSearchResult: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: '.c-entity__header .c-entity__title',
        },
        resultLink: {
          selector: '.c-entity__header .c-entity__link',
        },
      },
    },
    results: {
      selector: '.c-entity-list',
      commands: [
        {
          getSelectorForResultWithText,
        },
      ],
    },
  },
}
