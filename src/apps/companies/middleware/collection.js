const { pick, pickBy, assign } = require('lodash')

const { search, searchLimitedCompanies, searchCompanies } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const {
  transformCompanyToListItem,
  transformCompaniesHouseToListItem,
} = require('../transformers')

async function getCompanyCollection (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'company',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformCompanyToListItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
}

async function getLimitedCompaniesCollection (req, res, next) {
  const searchTerm = res.locals.searchTerm = req.query.term

  if (!searchTerm) {
    return next()
  }

  try {
    res.locals.results = await searchLimitedCompanies({
      searchTerm,
      token: req.session.token,
      page: req.query.page,
    })
      .then(
        transformApiResponseToSearchCollection(
          { query: req.query },
          transformCompaniesHouseToListItem,
          (item) => {
            return assign({}, item, {
              url: `/companies/add/${item.id}`,
            })
          }
        )
      )

    next()
  } catch (error) {
    next(error)
  }
}

async function getGlobalHQCompaniesCollection (req, res, next) {
  const searchTerm = res.locals.searchTerm = req.query.term
  const globalHQId = '43281c5e-92a4-4794-867b-b4d5f801e6f3'
  const { id: companyId } = res.locals.company

  if (!searchTerm) {
    return next()
  }

  try {
    res.locals.results = await searchCompanies({
      token: req.session.token,
      searchTerm,
      page: req.query.page,
      requestBody: {
        ...req.body,
        headquarter_type: globalHQId,
      },
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformCompanyToListItem,
        (item) => {
          return {
            ...item,
            url: `/companies/${companyId}/hierarchies/ghq/${item.id}/add`,
          }
        }
      ))

    next()
  } catch (error) {
    next(error)
  }
}

async function getSubsidiaryCompaniesCollection (req, res, next) {
  const searchTerm = res.locals.searchTerm = req.query.term
  const { id: companyId } = res.locals.company

  if (!searchTerm) {
    return next()
  }

  try {
    res.locals.results = await searchCompanies({
      token: req.session.token,
      searchTerm,
      page: req.query.page,
      requestBody: {
        ...req.body,
      },
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformCompanyToListItem,
        (item) => {
          return {
            ...item,
            url: `/companies/${item.id}/hierarchies/subsidiaries/${companyId}/add`,
          }
        }
      ))

    next()
  } catch (error) {
    next(error)
  }
}

function getRequestBody (req, res, next) {
  const selectedFiltersQuery = pick(req.query, [
    'name',
    'sector_descends',
    'country',
    'uk_region',
    'headquarter_type',
  ])

  const selectedSortBy = req.query.sortby ? {
    sortby: req.query.sortby,
  } : null

  req.body = assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))

  next()
}

module.exports = {
  getRequestBody,
  getCompanyCollection,
  getLimitedCompaniesCollection,
  getGlobalHQCompaniesCollection,
  getSubsidiaryCompaniesCollection,
}
