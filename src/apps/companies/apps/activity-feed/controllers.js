const { fetchActivityFeed } = require('./repos')

async function renderActivityFeed (req, res, next) {
  const { company } = res.locals
  try {
    const addContentParams = company.archived ? {} : {
      addContentText: 'Add interaction',
      addContentLink: `/companies/${company.id}/interactions/create`,
    }

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Activity Feed')
      .render('companies/apps/activity-feed/views/container', {
        params: {
          ...addContentParams,
          apiEndpoint: `/companies/${company.id}/activity-feed/data`,
        },
      })
  } catch (error) {
    next(error)
  }
}

async function fetchActivityFeedHandler (req, res, next) {
  try {
    const { company } = res.locals
    const { from = 0 } = req.query

    const results = await fetchActivityFeed({
      token: req.session.token,
      from,
      companyId: company.id,
    })

    res.json(results)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderActivityFeed,
  fetchActivityFeedHandler,
}