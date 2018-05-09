const FILTER_CONSTANTS = {
  COMPANIES: {
    SECTOR: {
      NAME: 'sector',
      PRIMARY: {
        NAME: 'sector_descends',
        QUERY_STRING: '?level__lte=0',
      },
    },
  },
  CONTACTS: {
    SECTOR: {
      NAME: 'sector',
      PRIMARY: {
        NAME: 'company_sector_descends',
        QUERY_STRING: '?level__lte=0',
      },
    },
  },
  INVESTMENT_PROJECTS: {
    SECTOR: {
      NAME: 'sector',
      PRIMARY: {
        NAME: 'sector_descends',
        QUERY_STRING: '?level__lte=0',
      },
    },
  },
  INTERACTIONS: {
    SECTOR: {
      NAME: 'sector',
      PRIMARY: {
        NAME: 'sector_descends',
        QUERY_STRING: '?level__lte=0',
      },
    },
  },
}

module.exports = FILTER_CONSTANTS