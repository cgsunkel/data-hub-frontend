const router = require('express').Router()

const { DEFAULT_COLLECTION_QUERY, APP_PERMISSIONS, LOCAL_NAV } = require('./constants')

const { setDefaultQuery, handleRoutePermissions, setLocalNav, redirectToFirstNavItem } = require('../middleware')
const { renderDetailsPage } = require('./controllers/details')
const { renderEditPage } = require('./controllers/edit')
const { postDetails, getEventDetails } = require('./middleware/details')
const { getRequestBody, getEventsCollection } = require('./middleware/collection')
const { renderEventList } = require('./controllers/list')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.route('/create')
  .post(postDetails, renderEditPage)
  .get(renderEditPage)

router.param('eventId', getEventDetails)

router.use('/:eventId', handleRoutePermissions(LOCAL_NAV), setLocalNav(LOCAL_NAV))

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody,
  getEventsCollection,
  renderEventList,
)

router.route('/:eventId/edit')
  .post(postDetails, renderEditPage)
  .get(renderEditPage)

router.get('/:eventId', redirectToFirstNavItem)
router.get('/:eventId/details', renderDetailsPage)

module.exports = router
