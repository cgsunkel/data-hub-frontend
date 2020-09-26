import {
  INVESTMENTS__PROJECTS_LOADED,
  INVESTMENTS__PROJECTS_SELECT_PAGE,
  INVESTMENTS__PROJECTS_FILTER_RESULTS,
  INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
} from '../../../../client/actions'

import { transformInvestmentProjectToListItem } from '../../transformers'

const initialState = {
  page: 1,
  count: undefined,
  results: [],
  isComplete: false,
  filters: {
    sortby: 'created_on:desc',
    page: 1,
  },
}

export default (state = initialState, { type, result, page, filters }) => {
  switch (type) {
    case INVESTMENTS__PROJECTS_LOADED:
      return {
        ...state,
        count: result.count,
        results: result.results?.map(transformInvestmentProjectToListItem),
        isComplete: true,
      }
    case INVESTMENTS__PROJECTS_SELECT_PAGE:
      return {
        ...state,
        page,
        filters: { ...state.filters, page },
      }
    case INVESTMENTS__PROJECTS_FILTER_RESULTS:
      return {
        ...state,
        filters: { ...state.filters, ...filters },
      }
    case INVESTMENTS__PROJECTS_SELECTED_ADVISERS:
      return {
        ...state,
        selectedFilters: {
          advisers: result
            ? Array.isArray(result)
              ? result.map(({ advisers }) => {
                  return {
                    label: advisers.name,
                    value: advisers.id,
                  }
                })
              : {
                  label: result.advisers.name,
                  value: result.advisers.id,
                }
            : null,
        },
      }
    default:
      return state
  }
}
