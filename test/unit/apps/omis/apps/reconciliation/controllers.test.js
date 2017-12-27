describe('OMIS reconciliation controllers', () => {
  beforeEach(() => {
    this.req = {
      session: {
        token: 'abcd',
      },
      query: {},
    }
    this.res = {
      breadcrumb: sandbox.stub().returnsThis(),
      render: sandbox.spy(),
      query: {},
    }
    this.buildSelectedFiltersSummaryStub = sandbox.spy()

    this.controller = proxyquire('~/src/apps/omis/apps/reconciliation/controllers', {
      '../../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
      },
      './macros': {
        filtersFields: [
          { macroName: 'foo' },
          { macroName: 'bar' },
        ],
      },
    })
  })

  describe('renderList()', () => {
    beforeEach(() => {
      this.controller.renderList(this.req, this.res)
    })

    it('should call render method', () => {
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should pass the correct data to the view', () => {
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('sortForm'))
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('filtersFields'))
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('selectedFilters'))
    })

    it('should build filters summary', () => {
      expect(this.buildSelectedFiltersSummaryStub).to.have.been.calledWith([
        { macroName: 'foo' },
        { macroName: 'bar' },
      ], this.req.query)
    })
  })
})
