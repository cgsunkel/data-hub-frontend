module.exports = {
  header: '.c-collection__header-intro',
  headerCount: '.c-collection__result-count',
  items: '.c-entity-list__item',
  error: 'h3',
  contentTable: (table) => {
    return `.c-details-container__content > table:nth-child(${table})`
  },
  contentHeader: '.govuk-heading-m',
  nav: 'a.c-entity-search__aggregations-link',
}
