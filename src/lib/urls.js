const config = require('../config')

function getTokens (path) {
  const tokens = []
  const parts = path.split('/')

  parts.forEach((part) => {
    if (part.startsWith(':')) {
      tokens.push(part)
    }
  })

  return tokens
}

function getPath (path, tokens, params) {
  if (path === '/') {
    return ''
  }
  tokens.forEach((token, index) => {
    path = path.replace(token, params[index])
  })
  return path
}

function url (mountPoint, path = '/') {
  const tokens = getTokens(path)

  function getUrl (...params) {
    return (mountPoint + getPath(path, tokens, params))
  }

  getUrl.mountPoint = mountPoint
  getUrl.route = path

  return getUrl
}

module.exports = {
  external: {
    greatProfile: (id) => config.greatProfileUrl.replace('{id}', id),
  },
  dashboard: url('/'),
  companies: {
    index: url('/companies'),
    detail: url('/companies', '/:companyId'),
    businessDetails: url('/companies', '/:companyId/business-details'),
    exports: url('/companies', '/:companyId/exports'),
    hierarchies: {
      ghq: {
        add: url('/companies', '/:companyId/hierarchies/ghq/:globalHqId/add'),
      },
    },
    dnbSubsidiaries: {
      index: url('/companies', '/:companyId/dnb-subsidiaries'),
      data: url('/companies', '/:companyId/dnb-subsidiaries/data'),
    },
  },
  contacts: {
    index: url('/contacts'),
  },
  search: {
    index: url('/search'),
    type: url('/search', '/:searchPath?'),
  },
}