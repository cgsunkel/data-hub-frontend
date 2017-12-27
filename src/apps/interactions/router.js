const router = require('express').Router()

const { GLOBAL_NAV_ITEMS } = require('../constants')
const { DEFAULT_COLLECTION_QUERY } = require('./constants')

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { renderInteractionList } = require('./controllers/list')

const { setDefaultQuery } = require('../middleware')
const {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
} = require('./middleware/collection')

const { postDetails, getInteractionOptions, getInteractionDetails } = require('./middleware/details')


router.param('interactionId', getInteractionDetails)

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getInteractionsRequestBody,
  getInteractionCollection,
  getInteractionSortForm,
  renderInteractionList
)

router
  .route('/:interactionId/:kind/edit')
  .post(
    getInteractionOptions,
    postDetails,
    renderEditPage,
  )
  .get(
    getInteractionOptions,
    renderEditPage,
  )

router.get('/:interactionId', renderDetailsPage)

module.exports = router
