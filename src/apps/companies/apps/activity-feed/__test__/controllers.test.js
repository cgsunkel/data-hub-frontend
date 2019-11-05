const { renderActivityFeed } = require('../controllers')
const { ACTIVITY_TYPE_FILTERS } = require('../../../constants')
const { ACTIVITY_TYPE_FILTER_KEYS } = require('../../../constants')
const config = require('../../../../../config')

const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder')
const activityFeedEsFixtures = require('~/test/unit/data/activity-feed/activity-feed-from-es')
const companyMock = require('~/test/unit/data/company.json')

describe('Activity feed controllers', () => {
  describe('#fetchActivityFeedHandler', () => {
    beforeEach(() => {
      this.fetchActivityFeedStub = sinon.stub().resolves(activityFeedEsFixtures)

      this.controllers = proxyquire('../../src/apps/companies/apps/activity-feed/controllers', {
        './repos': { fetchActivityFeed: this.fetchActivityFeedStub },
      })
    })

    context('when fetching feed for a company', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await this.controllers.fetchActivityFeedHandler(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with default params', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: {
            terms: {
              'object.type': config.activityFeed.supportedActivityTypes,
            },
          },
          from: 0,
          token: '1234',
        }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when filtering for "all" activity feed for a company', () => {
      const { allActivity } = ACTIVITY_TYPE_FILTER_KEYS
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            queryParams: 'all',
          },
        })

        await this.controllers.fetchActivityFeedHandler(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const expectedParams = { companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a', filter: { 'terms': { 'object.type': allActivity } }, from: 0, token: '1234' }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when filtering for "my" activity feed for a company', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            queryParams: 'my-activity',
          },
          user: {
            id: 123,
          },
        })

        await this.controllers.fetchActivityFeedHandler(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with "my" user id', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: { 'terms': { 'object.attributedTo.id': ['dit:DataHubAdviser:123'] } },
          from: 0,
          token: '1234',
        }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when filtering for "data-hub activity" activity feed for a company', () => {
      const { dataHubActivity } = ACTIVITY_TYPE_FILTER_KEYS
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            queryParams: 'datahub-activity',
          },
        })

        await this.controllers.fetchActivityFeedHandler(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: { 'terms': { 'object.type': dataHubActivity } },
          from: 0,
          token: '1234',
        }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when filtering for "external activity" activity feed for a company', () => {
      const { externalActivity } = ACTIVITY_TYPE_FILTER_KEYS
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            queryParams: 'external-activity',
          },
        })

        await this.controllers.fetchActivityFeedHandler(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: { 'terms': { 'object.type': externalActivity } },
          from: 0,
          token: '1234',
        }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when filtering param is invalid', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            queryParams: 'foobar',
          },
        })

        await this.controllers.fetchActivityFeedHandler(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with the right params', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: { 'terms': { 'object.type': config.activityFeed.supportedActivityTypes } },
          from: 0,
          token: '1234',
        }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when the endpoint returns error', () => {
      beforeEach(async () => {
        this.error = {
          statusCode: 404,
        }
        this.fetchActivityFeedStub.rejects(this.error)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await this.controllers.fetchActivityFeedHandler(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call next with an error', async () => {
        const expectedParams = {
          companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a',
          filter: {
            terms: {
              'object.type': config.activityFeed.supportedActivityTypes,
            },
          },
          from: 0,
          token: '1234',
        }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.middlewareParameters.resMock.json).to.not.have.been.called
        expect(this.middlewareParameters.nextSpy).to.have.been.calledWith(this.error)
      })
    })
  })

  describe('#renderActivityFeed', () => {
    context('when the feed renders successfully', () => {
      const { allActivity, dataHubActivity, externalActivity, myActivity } = ACTIVITY_TYPE_FILTERS
      const addActivityTypeFilter = {
        allActivity,
        myActivity: {
          label: myActivity.label,
          value: 'my-activity',
        },
        externalActivity,
        dataHubActivity,
      }

      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          user: {
            id: 123,
          },
        })

        await renderActivityFeed(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should render', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledOnce
      })

      it('should render the activity feed template', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/activity-feed/views/client-container', {
            props: {
              addActivityTypeFilter,
              addContentLink: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a/interactions/create',
              addContentText: 'Add interaction',
              apiEndpoint: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a/activity/data',
              isTypeFilterEnabled: undefined,
            },
          })
      })

      it('should add a breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb.firstCall).to.be.calledWith(
          'Wonka Industries',
          '/companies/dcdabbc9-1781-e411-8955-e4115bead28a'
        )
        expect(this.middlewareParameters.resMock.breadcrumb.lastCall).to.be.calledWith('Activity Feed')
      })

      it('should not call "next" with an error', async () => {
        expect(this.middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context('when viewing the feed for archived company', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            archived: true,
          },
          user: {
            id: 123,
          },
        })

        await renderActivityFeed(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should render the template without the "Add interaction" button', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledOnceWithExactly('companies/apps/activity-feed/views/client-container', {
          props: {
            apiEndpoint: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a/activity/data',
          },
        })
      })
    })

    context('when the rendering fails', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          user: {
            id: 123,
          },
        })

        this.error = new Error('Could not render')

        const errorRes = {
          ...this.middlewareParameters.resMock,
          render: () => { throw this.error },
        }

        await renderActivityFeed(
          this.middlewareParameters.reqMock,
          errorRes,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call next with an error', async () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledWith(this.error)
      })
    })
  })
})
