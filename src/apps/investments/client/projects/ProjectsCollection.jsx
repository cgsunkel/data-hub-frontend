import React from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { omit } from 'lodash'

import queryString from 'query-string'

import {
  FilterAdvisersTypeAhead,
  CollectionFilters,
  ToggleSection,
  CollectionList,
} from '../../../../client/components'

import { TASK_GET_PROJECTS_LIST, TASK_GET_ADVISER_NAME, ID } from './state'
import { COLLECTION_LISTS } from '../../../../client/actions'

const {
  INVESTMENTS__PROJECTS: {
    INVESTMENTS__PROJECTS_LOADED,
    INVESTMENTS__PROJECTS_SELECT_PAGE,
    INVESTMENTS__PROJECTS_FILTER_RESULTS,
    INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
  },
} = COLLECTION_LISTS

import { sortOptions } from './labels'

const ProjectsCollection = (props) => {
  const {
    onFilterChange,
    router: {
      location: { search },
    },
  } = props

  const { adviser } = queryString.parse(search)
  const { page, filters } = props[ID]

  const tasks = {
    collectionListTask: {
      name: TASK_GET_PROJECTS_LIST,
      id: ID,
      progressMessage: 'loading projects...',
      startOnRender: {
        payload: { page, filters, search },
        onSuccessDispatch: INVESTMENTS__PROJECTS_LOADED,
      },
    },
    adviserListTask: {
      name: TASK_GET_ADVISER_NAME,
      id: ID,
      progressMessage: 'loading projects...',
      startOnRender: {
        payload: { adviser },
        onSuccessDispatch: INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
      },
    },
  }

  return (
    <Route>
      {(routerProps) => (
        <CollectionList
          {...props}
          {...props[ID]}
          {...routerProps}
          collectionName="Project"
          sortOptions={sortOptions}
          task={tasks.collectionListTask}
          maxItemsToDownload={5000}
        >
          <CollectionFilters>
            <ToggleSection
              label="Company information"
              id="projects.filters.company.information"
            >
              <FilterAdvisersTypeAhead
                {...props}
                {...props[ID]}
                task={tasks.adviserListTask}
                isMulti={true}
                closeMenuOnSelect={false}
                label="Advisers"
                name="advisers"
                placeholder="Search advisers..."
                noOptionsMessage={() => <span>No advisers found</span>}
                onChange={(advisers) =>
                  onFilterChange(
                    {
                      adviser: advisers
                        ? advisers.map(({ value }) => value)
                        : [],
                    },
                    routerProps.history,
                    advisers,
                    filters
                  )
                }
              />
            </ToggleSection>
          </CollectionFilters>
        </CollectionList>
      )}
    </Route>
  )
}

export default connect(
  (state) => state,
  (dispatch) => ({
    onPageClick: (page, history, filters) => {
      history.push({
        search: queryString.stringify({
          ...filters,
          page,
        }),
      })
      dispatch({
        type: INVESTMENTS__PROJECTS_SELECT_PAGE,
        page,
      })
    },
    onFilterChange: (targetValue, history, advisers, filters) => {
      const stateFilters = !targetValue.sortby ? omit(filters, 'page') : filters
      history.replace({
        search: queryString.stringify({
          ...stateFilters,
          ...targetValue,
        }),
      })
      dispatch({
        type: INVESTMENTS__PROJECTS_FILTER_RESULTS,
        filters,
        advisers,
      })
    },
  })
)(ProjectsCollection)
