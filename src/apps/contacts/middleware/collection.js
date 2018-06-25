const { pick, pickBy } = require('lodash')

const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformContactToListItem } = require('../transformers')
const removeArray = require('../../../lib/remove-array')

async function getContactsCollection (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'contact',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformContactToListItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
}

function getRequestBody (req, res, next) {
  const selectedFiltersQuery = removeArray(pick(req.query, [
    'archived',
    'name',
    'company_name',
    'company_sector_descends',
    'address_country',
    'company_uk_region',
  ]), 'archived')

  const selectedSortBy = req.query.sortby
    ? { sortby: req.query.sortby }
    : null

  req.body = {
    ...req.body,
    ...selectedSortBy,
    ...pickBy(selectedFiltersQuery),
  }

  next()
}

module.exports = {
  getContactsCollection,
  getRequestBody,
}
