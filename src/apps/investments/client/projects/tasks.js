import axios from 'axios'
import queryString from 'query-string'

function handleSuccess({ data }) {
  return data
}

function handleError(error) {
  const message = error?.response?.data?.detail || error.message
  return Promise.reject({
    message,
    ...error,
  })
}

async function getProjects({ limit = 10, page = 1, filters = {}, search }) {
  const parsedQuery = queryString.parse(search)

  const offset = limit * (parseInt(parsedQuery.page) - 1) || 0

  return axios
    .post('/api-proxy/v3/search/investment_project', {
      limit,
      offset,
      page,
      ...filters,
      ...parsedQuery,
    })
    .then(handleSuccess, handleError)
}

async function getAdviserNames({ adviser }) {
  if (!adviser) {
    return
  }
  return Array.isArray(adviser)
    ? axios
        .all(
          adviser.map((adviser) => axios.get(`/api-proxy/adviser/${adviser}/`))
        )
        .then(
          axios.spread((...responses) =>
            responses.map(({ data }) => ({
              advisers: data,
            }))
          )
        )
    : axios.get(`/api-proxy/adviser/${adviser}/`).then(
        ({ data }) => ({
          advisers: data,
        }),
        handleError
      )
}

export { getProjects, getAdviserNames }
