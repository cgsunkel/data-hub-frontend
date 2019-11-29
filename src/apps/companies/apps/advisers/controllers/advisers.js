const { getOneListGroupCoreTeam } = require('../../../repos')
const config = require('../../../../../config')
const { transformCoreTeamToCollection, transformAccountManager } = require('../../../transformers')
const { coreTeamLabels } = require('../../../labels')
const { isItaTierDAccount } = require('../../../../../lib/is-tier-type-company')
const { companies } = require('../../../../../../src/lib/urls')
const { authorisedRequest } = require('../../../../../lib/authorised-request')
const urls = require('../../../../../lib/urls')

function renderLeadAdvisers (req, res) {
  const { company, user: { permissions } } = res.locals
  const hasAccountManager = !!company.one_list_group_global_account_manager
  const { name = null, team = null, email = null } = hasAccountManager ? transformAccountManager(company) : {}

  res
    .breadcrumb(company.name, `${companies.detail(company.id)}`)
    .breadcrumb('Lead adviser')
    .render('companies/views/lead-advisers', {
      props: {
        hasAccountManager,
        name,
        team,
        email,
        companyName: company.name,
        companyId: company.id,
        addUrl: companies.advisers.assign(company.id),
        removeUrl: companies.advisers.remove(company.id),
        hasPermissionToAddIta: permissions.includes('company.change_regional_account_manager'),
      },
    })
}

async function renderCoreTeamAdvisers (req, res, next) {
  try {
    const { company } = res.locals
    const token = req.session.token
    const { global_account_manager: globalAccountManager, adviser_on_core_team: adviserOnCoreTeam, location, team } = coreTeamLabels
    const columns = {
      'global_account_manager': {
        team,
        location,
        name: globalAccountManager,
      },
      'adviser_core_team': {
        team,
        location,
        name: adviserOnCoreTeam,
      },
    }
    const coreTeam = await getOneListGroupCoreTeam(token, company.id)
      .then(transformCoreTeamToCollection)
    res
      .breadcrumb(company.name, urls.companies.detail(company.id))
      .breadcrumb('Advisers')
      .render('companies/views/advisers', {
        coreTeam,
        columns,
        oneListEmail: config.oneList.email,
        companyName: company.name,
      })
  } catch (error) {
    next(error)
  }
}

async function renderAdvisers (req, res, next) {
  const { company, features } = res.locals
  features.lead_advisers && (isItaTierDAccount(company) || company.one_list_group_tier === null)
    ? renderLeadAdvisers(req, res)
    : await renderCoreTeamAdvisers(req, res, next)
}

// istanbul ignore next: Only testable with whitebox tests and alerady covered by functional tests
const renderAddAdviserForm = (req, res) => {
  const rawLeadITA = res.locals.company.one_list_group_global_account_manager
  const { name, id } = res.locals.company
  const currentLeadITA = rawLeadITA && {
    name: rawLeadITA.name,
    team: rawLeadITA.dit_team.name,
  }
  res
    .breadcrumb(name, urls.companies.detail(id))
    .breadcrumb(
      currentLeadITA
        ? 'Replace the Lead ITA'
        : 'Confirm you are the Lead ITA'
    )
    .render('companies/apps/advisers/views/add-adviser.njk', {
      props: {
        currentLeadITA,
        cancelUrl: urls.companies.advisers.index(id),
      },
    })
}

// istanbul ignore next: Only testable with whitebox tests and alerady covered by functional tests
async function addAdviser (req, res, next) {
  const { company: { id } } = res.locals

  try {
    await authorisedRequest(req.session.token, {
      method: 'POST',
      url: `${config.apiRoot}/v4/company/${id}/self-assign-account-manager`,
    })

    req.flash('success', 'Lead adviser information updated')
    res.redirect(urls.companies.advisers.index(id))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAdvisers,
  addAdviser,
  renderAddAdviserForm,
}