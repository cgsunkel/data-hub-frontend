/* eslint-disable camelcase */
const { isEmpty, set, get } = require('lodash')

const { meetingHappenForm } = require('../macros/index')
const { saveInteraction, archiveInteraction } = require('../repos')
const { buildFormWithStateAndErrors } = require('../../builders')
const { ERROR } = require('../../constants')
const { ARCHIVED_REASON } = require('../constants')
const { joinPaths } = require('../../../lib/path')
const { getReturnLink } = require('../helpers')

function renderCompletePage (req, res) {
  const {
    interactions,
    interaction,
    userAgent,
    errors,
  } = res.locals

  const breadcrumbs = get(interactions, 'breadcrumbs', [])
  breadcrumbs.forEach(({ text, href }) => res.breadcrumb(text, href))

  const form = meetingHappenForm({
    userAgent,
    returnLink: joinPaths([ getReturnLink(interactions), interaction.id ]),
  })

  return res
    .breadcrumb('Interaction')
    .title('Did the meeting take place?')
    .render('interactions/views/complete', {
      meetingHappenForm: buildFormWithStateAndErrors(form, req.body, errors),
    })
}

async function postComplete (req, res, next) {
  if (!req.body.meeting_happen) {
    set(res.locals, 'errors.meeting_happen', [ ERROR.SELECT_AN_OPTION ])
  }

  if (req.body.meeting_happen === 'false' && !req.body.archived_reason) {
    set(res.locals, 'errors.archived_reason', [ ERROR.SELECT_AN_OPTION ])
  }

  if (req.body.archived_reason === ARCHIVED_REASON.RESCHEDULED && !req.body.date) {
    set(res.locals, 'errors.date', [ ERROR.ENTER_A_DATE ])
  }

  if (!isEmpty(res.locals.errors)) {
    return next()
  }

  const { token } = req.session
  const { interaction, interactions } = res.locals
  if (req.body.meeting_happen === 'false') {
    try {
      if (req.body.archived_reason === ARCHIVED_REASON.RESCHEDULED) {
        await saveInteraction(token, {
          id: interaction.id,
          date: req.body.date,
        })
      } else {
        await archiveInteraction(token, interaction.id, req.body.archived_reason)
      }

      req.flash('success', 'The interaction has been updated')
      return res.redirect(getReturnLink(interactions))
    } catch (e) {
      return next(e)
    }
  }

  if (req.body.meeting_happen === 'true') {
    const path = joinPaths([ `/companies/${interaction.company.id}/interactions`, interaction.id, 'create' ])
    return res.redirect(path)
  }
}

module.exports = {
  renderCompletePage,
  postComplete,
}
