const { find } = require('lodash')

const { company } = require('../../features/setup/fixtures')

module.exports = {
  url: function companyFixtureUrl (companyName) {
    const fixture = find(company, { name: companyName })
    const companyId = fixture ? fixture.pk : company.ukLtd.pk

    return `${process.env.QA_HOST}/companies/${companyId}`
  },
  elements: {},
}
