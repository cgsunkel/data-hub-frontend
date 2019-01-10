const logger = require('../../../../../config/logger')
const { updateInvestment } = require('../../repos')

function handleFormPost (req, res, next, projectId = req.params.investmentId) {
  updateInvestment(req.session.token, projectId, {
    stage: {
      id: req.body.next_project_stage,
    },
  })
    .then(() => {
      req.flash('success', `Investment project moved to ${res.locals.investmentStatus.nextStage.name} stage`)
      res.redirect(`/investment-projects/${res.locals.investment.id}/details`)
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        logger.error(err)
        req.flash('error', err.error.stage ? err.error.stage.toString() : 'Something has gone wrong')
        return res.redirect(`/investment-projects/${res.locals.investment.id}/details`)
      }
      next(err)
    })
}

module.exports = {
  handleFormPost,
}
