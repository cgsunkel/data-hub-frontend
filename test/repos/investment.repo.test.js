const nock = require('nock')
const config = require(`${root}/src/config`)

const {
  getCompanyInvestmentProjects,
  getInvestmentProjectSummary,
  getInvestmentValue,
  getInvestmentRequirements
} = require(`${root}/src/repos/investment.repo`)

const companyData = require('../data/company.json')
const investmentProjectSummaryData = require('../data/investment/project-summary.json')
const investmentValueData = require('../data/investment/project-value.json')
const investmentRequirements = require('../data/investment/project-requirements.json')

describe('Investment repository', () => {
  describe('#getCompanyInvestmentProjects', () => {
    nock(config.apiRoot)
      .get(`/v3/investment/project?investor_company_id=${companyData.id}`)
      .reply(200, companyData)

    it('should return a company object', () => {
      const actual = getCompanyInvestmentProjects('token', companyData.id)

      return expect(actual).to.eventually.deep.equal(companyData)
    })
  })

  describe('#getInvestmentProjectSummary', () => {
    nock(config.apiRoot)
      .get(`/v3/investment/${investmentProjectSummaryData.id}/project`)
      .reply(200, investmentProjectSummaryData)

    it('should return an investment project summary object', () => {
      const actual = getInvestmentProjectSummary('token', investmentProjectSummaryData.id)

      return expect(actual).to.eventually.deep.equal(investmentProjectSummaryData)
    })
  })

  describe('#getInvestmentValue', () => {
    nock(config.apiRoot)
      .get(`/v3/investment/${investmentProjectSummaryData.id}/value`)
      .reply(200, investmentValueData)

    it('should return an investment value object', () => {
      const actual = getInvestmentValue('token', investmentProjectSummaryData.id)

      return expect(actual).to.eventually.deep.equal(investmentValueData)
    })
  })

  describe('#getInvestmentRequirements', () => {
    nock(config.apiRoot)
      .get(`/v3/investment/${investmentProjectSummaryData.id}/requirements`)
      .reply(200, investmentRequirements)

    it('should return an investment requirements object', () => {
      const actual = getInvestmentRequirements('token', investmentProjectSummaryData.id)

      return expect(actual).to.eventually.deep.equal(investmentRequirements)
    })
  })
})
