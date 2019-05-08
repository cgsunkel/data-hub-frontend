const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')
const companyProfile = require('~/test/unit/data/companies/investments/large-capital-profile.json')
const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const config = require('../../../../../../../config')

describe('#updateCompanyProfile', () => {
  beforeEach(() => {
    this.transformInvestorDetailsStub = sinon.stub()
    this.updateCompanyProfileStub = sinon.stub()

    this.controller = proxyquire('~/src/apps/companies/apps/investments/large-capital-profile/controllers/update', {
      '../transformers': {
        transformInvestorDetails: this.transformInvestorDetailsStub,
      },
      '../repos': {
        updateCompanyProfile: this.updateCompanyProfileStub,
      },
    })
  })

  context('when updateCompanyProfile returns successfully', () => {
    beforeEach(async () => {
      this.requestBody = {
        profileId: '123',
        editing: 'investor-details',
      }

      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
        requestBody: this.requestBody,
      })

      this.transformInvestorDetailsStub.returns({})

      nock(config.apiRoot)
        .patch(`/v4/large-investor-profile/123`)
        .reply(200, companyProfile)

      await this.controller.updateProfile(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should call transformInvestorDetails with the request body', () => {
      expect(this.transformInvestorDetailsStub).to.have.been.calledWith(this.requestBody)
    })

    it('should call updateCompanyProfile with the correct arguments', () => {
      expect(this.updateCompanyProfileStub).to.have.been.calledWith('1234', {}, '123')
    })

    it('should call redirect once', () => {
      expect(this.middlewareParameters.resMock.redirect).to.have.been.calledOnce
    })

    it('should call redirect with the correct route', () => {
      const route = `/companies/${companyMock.id}/investments/large-capital-profile`
      expect(this.middlewareParameters.resMock.redirect).to.be.calledWith(route)
    })

    it('should not call next', () => {
      expect(this.middlewareParameters.nextSpy).to.not.be.called
    })
  })

  context('when updateCompanyProfile rejects', () => {
    beforeEach(async () => {
      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
        requestBody: {},
      })

      this.errorMock = {
        errorCode: 500,
      }

      this.updateCompanyProfileStub.rejects(this.errorMock)

      await this.controller.updateProfile(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should call next with an error', () => {
      expect(this.middlewareParameters.nextSpy).to.have.been.calledWith(this.errorMock)
      expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
    })
  })
})