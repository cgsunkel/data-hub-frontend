/* eslint-disable camelcase */
const { find, get } = require('lodash')
const moment = require('moment')
const { requiredChecks: types } = require('../constants')

const {
  transformAdviserToOption,
} = require('../../../../../adviser/transformers')

const parseDate = (dateStr) => {
  const date = moment(dateStr, 'YYYY-MM-DD', true)
  return {
    day: date.date(),
    month: date.month() + 1,
    year: date.year(),
  }
}

const transformInvestorTypes = (investorTypesMetadata, { investorType }) => {
  const { value } = investorType

  if (value) {
    find(investorTypesMetadata, (item) => item.value === value).selected = true
  }

  investorTypesMetadata.unshift({
    value: null,
    text: '-- Please select an investor type --',
  })

  return investorTypesMetadata
}

const transformRequiredChecks = (
  requiredChecksMetadata,
  { requiredChecks }
) => {
  const transformed = {
    cleared: find(
      requiredChecksMetadata,
      (item) => item.text === types.CLEARED
    ),
    issuesIdentified: find(
      requiredChecksMetadata,
      (item) => item.text === types.ISSUES_IDENTIFIED
    ),
    notYetChecked: find(
      requiredChecksMetadata,
      (item) => item.text === types.NOT_YET_CHECKED
    ),
    notRequired: find(
      requiredChecksMetadata,
      (item) => item.text === types.CHECKS_NOT_REQUIRED
    ),
  }

  const type = get(requiredChecks, 'type.name')

  if (type === types.CLEARED) {
    transformed.cleared.adviser = requiredChecks.adviser
    transformed.cleared.date = parseDate(requiredChecks.date)
  }

  if (type === types.ISSUES_IDENTIFIED) {
    transformed.issuesIdentified.adviser = requiredChecks.adviser
    transformed.issuesIdentified.date = parseDate(requiredChecks.date)
  }

  const id = get(requiredChecks, 'type.id')
  if (id) {
    find(requiredChecksMetadata, (item) => item.value === id).checked = true
  }

  return transformed
}

const transformAdvisers = (advisers) => {
  return advisers.map(transformAdviserToOption)
}

module.exports = {
  transformAdvisers,
  transformInvestorTypes,
  transformRequiredChecks,
}
