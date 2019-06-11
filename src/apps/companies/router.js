
const router = require('express').Router()
const { ENTITIES } = require('../search/constants')
const { LOCAL_NAV, DEFAULT_COLLECTION_QUERY, APP_PERMISSIONS, QUERY_FIELDS } = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const { getCollection, exportCollection } = require('../../modules/search/middleware/collection')

const {
  renderAddStepOne,
  postAddStepOne,
  renderAddStepTwo,
} = require('./controllers/add')

const { renderCompanyList } = require('./controllers/list')
const { renderForm } = require('./controllers/edit')
const { renderDetails } = require('./controllers/details')
const { renderBusinessDetails } = require('./controllers/business-details')
const { renderOrders } = require('./controllers/orders')
const { renderAuditLog } = require('./controllers/audit')
const { renderTimeline } = require('./controllers/timeline')
const { archiveCompany, unarchiveCompany } = require('./controllers/archive')
const { renderContacts } = require('./controllers/contacts')
const { renderDocuments } = require('./controllers/documents')
const { renderAddGlobalHQ } = require('./controllers/hierarchies')
const { renderSubsidiaries } = require('./controllers/subsidiaries')
const { renderLinkSubsidiary } = require('./controllers/subsidiary-link')
const { renderAdvisers } = require('./controllers/advisers')

const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
} = require('./controllers/exports')

const { setDefaultQuery, redirectToFirstNavItem, handleRoutePermissions } = require('../middleware')

const {
  getLimitedCompaniesCollection,
  getGlobalHQCompaniesCollection,
  getSubsidiaryCompaniesCollection,
} = require('./middleware/collection')

const { setCompanyContactRequestBody, getCompanyContactCollection } = require('./middleware/contact-collection')
const { populateForm, handleFormPost } = require('./middleware/form')
const { getCompany, getCompaniesHouseRecord } = require('./middleware/params')
const { setInteractionsDetails } = require('./middleware/interactions')
const { setGlobalHQ, removeGlobalHQ, addSubsidiary } = require('./middleware/hierarchies')
const setCompaniesLocalNav = require('./middleware/local-navigation')

const { transformCompanyToListItem } = require('./transformers')

const investmentsRouter = require('./apps/investments/router')
const matchingRouter = require('./apps/matching/router')
const interactionsRouter = require('../interactions/router.sub-app')
const activityFeedRouter = require('./apps/activity-feed/router')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('companyId', getCompany)
router.param('companyNumber', getCompaniesHouseRecord)

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  getCollection('company', ENTITIES, transformCompanyToListItem),
  renderCompanyList,
)

router.get('/export',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  exportCollection('company'),
)

router
  .route('/add-step-1')
  .get(renderAddStepOne)
  .post(postAddStepOne, renderAddStepOne)

router.get('/add-step-2', getLimitedCompaniesCollection, renderAddStepTwo)

router
  .route('/:companyId/exports/edit')
  .get(populateExportForm, renderExportEdit)
  .post(populateExportForm, handleEditFormPost, renderExportEdit)

router
  .route([
    '/add',
    '/add/:companyNumber',
  ])
  .get(populateForm, renderForm)
  .post(handleFormPost, populateForm, renderForm)

router
  .route('/:companyId/edit')
  .get(populateForm, renderForm)
  .post(handleFormPost, populateForm, renderForm)

router.post('/:companyId/archive', archiveCompany)
router.get('/:companyId/unarchive', unarchiveCompany)

router.use('/:companyId', handleRoutePermissions(LOCAL_NAV), setCompaniesLocalNav)
router.get('/:companyId', redirectToFirstNavItem)
router.get('/:companyId/details', renderDetails)
router.get('/:companyId/business-details', renderBusinessDetails)
router.get('/:companyId/advisers', renderAdvisers)

router.get('/:companyId/hierarchies/ghq/search', getGlobalHQCompaniesCollection, renderAddGlobalHQ)
router.get('/:companyId/hierarchies/ghq/:globalHqId/add', setGlobalHQ)
router.get('/:companyId/hierarchies/ghq/remove', removeGlobalHQ)

router.get('/:companyId/hierarchies/subsidiaries/search', getSubsidiaryCompaniesCollection, renderLinkSubsidiary)
router.get('/:companyId/hierarchies/subsidiaries/:subsidiaryCompanyId/add', addSubsidiary)

router.get('/:companyId/contacts',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  setCompanyContactRequestBody,
  getCompanyContactCollection,
  renderContacts
)

router.get('/:companyId/exports', renderExports)
router.get('/:companyId/subsidiaries', renderSubsidiaries)
router.get('/:companyId/subsidiaries/link', renderLinkSubsidiary)
router.get('/:companyId/orders', renderOrders)
router.get('/:companyId/audit', renderAuditLog)
router.get('/:companyId/documents', renderDocuments)
router.get('/:companyId/timeline', renderTimeline)

router.use('/:companyId/investments', investmentsRouter)
router.use('/:companyId/matching', matchingRouter)
router.use('/:companyId', setInteractionsDetails, interactionsRouter)
router.use('/:companyId/activity-feed', activityFeedRouter)

module.exports = router
