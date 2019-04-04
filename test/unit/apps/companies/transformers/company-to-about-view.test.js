const { aboutLabels } = require('~/src/apps/companies/labels')
const { NOT_SET_TEXT } = require('~/src/apps/companies/constants')

const transformCompanyToAboutView = proxyquire('~/src/apps/companies/transformers/company-to-about-view', {
  '../../../../config': {
    currencyRate: {
      usdToGbp: 0.75,
    },
  },
})

describe('#transformCompanyToKnownAsView', () => {
  const commonTests = (expectedTradingNames, expectedWebsite, expectedEmployees, expectedTurnover) => {
    it('should set the trading name', () => {
      expect(this.actual[aboutLabels.trading_names]).to.deep.equal(expectedTradingNames)
    })

    it('should set the website', () => {
      expect(this.actual[aboutLabels.website]).to.deep.equal(expectedWebsite)
    })

    it('should set the number of employees', () => {
      expect(this.actual[aboutLabels.number_of_employees]).to.deep.equal(expectedEmployees)
    })

    it('should set the turnover', () => {
      expect(this.actual[aboutLabels.turnover]).to.deep.equal(expectedTurnover)
    })
  }

  context('when business data is from Dun & Bradstreet', () => {
    context('when all information is populated', () => {
      beforeEach(() => {
        this.actual = transformCompanyToAboutView({
          duns_number: '1',
          business_type: {
            name: 'Company',
          },
          trading_names: [
            'trading name 1',
            'trading name 2',
          ],
          company_number: '123456',
          website: 'www.company.com',
          turnover: 100000,
          number_of_employees: 200,
          description: 'description',
        })
      })

      commonTests(
        [
          'trading name 1',
          'trading name 2',
        ],
        {
          url: 'www.company.com',
          name: 'www.company.com',
          hint: '(Opens in a new window)',
          hintId: 'external-link-label',
          newWindow: true,
        },
        [
          {
            name: 200,
            type: 'number',
          },
          {
            details: {
              summaryText: 'What does that mean?',
              text: 'Actual number of employees is not available for this business. The number has been modelled by Dun & Bradstreet, based on similar businesses.',
            },
            name: 'This is an estimated number',
            type: 'details',
          },
        ],
        [
          {
            type: 'currency',
            name: 75000,
          },
          {
            details: {
              summaryText: 'What does that mean?',
              text: 'Actual turnover is not available for this business. The number has been modelled by Dun & Bradstreet, based on similar businesses.',
            },
            name: 'This is an estimated number',
            type: 'details',
          },
        ],
      )

      it('should not set the business type', () => {
        expect(this.actual['Business type']).to.not.exist
      })

      it('should set the Companies House number', () => {
        expect(this.actual['Companies House number'][0]).to.equal('123456')
      })

      it('should set the Companies House link', () => {
        expect(this.actual['Companies House number'][1]).to.deep.equal({
          url: 'https://beta.companieshouse.gov.uk/company/123456',
          name: 'View on Companies House website',
          hint: '(Opens in a new window)',
          hintId: 'external-link-label',
          newWindow: true,
        })
      })

      it('should set the description', () => {
        expect(this.actual.Description).to.equal('description')
      })
    })

    context('when minimal information is populated', () => {
      beforeEach(() => {
        this.actual = transformCompanyToAboutView({
          duns_number: '1',
          business_type: {
            name: 'Company',
          },
        })
      })

      commonTests(
        NOT_SET_TEXT,
        NOT_SET_TEXT,
        NOT_SET_TEXT,
        NOT_SET_TEXT,
      )

      it('should not set the business type', () => {
        expect(this.actual['Business type']).to.not.exist
      })

      it('should not set the Companies House number', () => {
        expect(this.actual['Companies House number']).to.not.exist
      })

      it('should not set the description', () => {
        expect(this.actual.Description).to.not.exist
      })
    })
  })

  context('when business data is from Data Hub', () => {
    context('when all information is populated', () => {
      beforeEach(() => {
        this.actual = transformCompanyToAboutView({
          business_type: {
            name: 'Company',
          },
          trading_names: [
            'trading name 1',
            'trading name 2',
          ],
          company_number: '123456',
          vat_number: '0123456789',
          turnover_range: {
            name: '£33.5M+',
          },
          employee_range: {
            name: '500+',
          },
          website: 'www.company.com',
          description: 'description',
        })
      })

      commonTests(
        [
          'trading name 1',
          'trading name 2',
        ],
        {
          url: 'www.company.com',
          name: 'www.company.com',
          hint: '(Opens in a new window)',
          hintId: 'external-link-label',
          newWindow: true,
        },
        '500+',
        '£33.5M+',
      )

      it('should set the Companies House number', () => {
        expect(this.actual['Companies House number'][0]).to.equal('123456')
      })

      it('should set the Companies House link', () => {
        expect(this.actual['Companies House number'][1]).to.deep.equal({
          url: 'https://beta.companieshouse.gov.uk/company/123456',
          name: 'View on Companies House website',
          hint: '(Opens in a new window)',
          hintId: 'external-link-label',
          newWindow: true,
        })
      })

      it('should set the business type', () => {
        expect(this.actual['Business type']).to.equal('Company')
      })

      it('should set the VAT number', () => {
        expect(this.actual['VAT number']).to.equal('0123456789')
      })

      it('should set the description', () => {
        expect(this.actual.Description).to.equal('description')
      })
    })

    context('when minimal information is populated', () => {
      beforeEach(() => {
        this.actual = transformCompanyToAboutView({
          business_type: {
            name: 'Company',
          },
        })
      })

      commonTests(
        NOT_SET_TEXT,
        NOT_SET_TEXT,
        NOT_SET_TEXT,
        NOT_SET_TEXT,
      )

      it('should not set the Companies House number', () => {
        expect(this.actual['Companies House number']).to.not.exist
      })

      it('should set the business type', () => {
        expect(this.actual['Business type']).to.equal('Company')
      })

      it('should not set the VAT number', () => {
        expect(this.actual['VAT number']).to.not.exist
      })

      it('should not set the description', () => {
        expect(this.actual.Description).to.not.exist
      })
    })
  })
})
