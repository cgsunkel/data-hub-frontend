const { mapValues, isObject, isFunction } = require('lodash')

const host = process.env.QA_HOST

const deepMap = (value, host) => {
  if (isFunction(value)) {
    return value
  }

  return isObject(value)
    ? mapValues(value, (v) => deepMap(v, host))
    : `${host}/${value}`
}

const urls = {
  company: {
    collection: 'companies',
    search: 'search/companies',
    getDetails (id) {
      return `${host}/companies/${id}/details`
    },
  },
  contact: {
    collection: 'contacts',
    getDetails (id) {
      return `${host}/contacts/${id}/details`
    },
  },
  event: {
    collection: 'events',
    getDetails (id) {
      return `${host}/events/${id}`
    },
  },
  interactionsAndService: {
    collection: 'interactions',
    getDetails (id) {
      return `${host}/interactions/${id}`
    },
  },
  investmentProject: {
    collection: 'investment-projects',
    getDetails (id) {
      return `${host}/investment-projects/${id}/details`
    },
  },
}

module.exports = deepMap(urls, host)
