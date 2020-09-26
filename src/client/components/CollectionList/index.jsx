/* eslint-disable react/no-array-index-key */
// this is because there isn't necessarily a unique id to use as the key

import React from 'react'
import PropTypes from 'prop-types'

import { GridRow, GridCol } from 'govuk-react'
import Task from '../../../client/components/Task'

import {
  Pagination,
  CollectionDownload,
  CollectionHeader,
  CollectionSort,
  CollectionItem,
} from '../../components'

const CollectionList = ({
  results = [],
  itemsPerPage = 10,
  sortOptions = null,
  onFilterChange,
  taskProps,
  count = 0,
  filters,
  isComplete,
  children,
  collectionName,
  router: {
    location: { search, query },
  },
  history,
  onPageClick,
  maxItemsToDownload,
}) => {
  const totalPages = Math.ceil(count / itemsPerPage)
  return (
    <GridRow>
      {children}
      <GridCol setWidth={children ? `two-thirds` : `full`}>
        <article>
          {collectionName && (
            <CollectionHeader
              totalItems={count}
              collectionName={collectionName}
            />
          )}
          {sortOptions && (
            <CollectionSort
              query={query}
              filters={filters}
              history={history}
              sortOptions={sortOptions}
              totalPages={count}
              onFilterChange={onFilterChange}
            />
          )}
          {collectionName && (
            <CollectionDownload
              maxItemsToDownload={maxItemsToDownload}
              totalItems={count}
              collectionName={collectionName}
              downloadUrl={collectionName}
              search={search}
            />
          )}
          <Task.Status {...taskProps}>
            {() =>
              isComplete && (
                <>
                  {results.map((item, i) => (
                    <CollectionItem {...item} key={i} />
                  ))}
                  <Pagination
                    onPageClick={onPageClick}
                    totalPages={totalPages}
                    history={history}
                    filters={filters}
                  />
                </>
              )
            }
          </Task.Status>
        </article>
      </GridCol>
    </GridRow>
  )
}

CollectionList.propTypes = {
  onFilterChange: PropTypes.func,
  task: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    progressMessage: PropTypes.string,
    startOnRender: PropTypes.shape({
      payload: PropTypes.shape({
        page: PropTypes.number.isRequired,
        filters: PropTypes.object,
        search: PropTypes.string,
      }).isRequired,
      onSuccessDispatch: PropTypes.string,
    }).isRequired,
  }).isRequired,
  filters: PropTypes.object,
  isComplete: PropTypes.bool,
  children: PropTypes.node,
  collectionName: PropTypes.string,
  router: PropTypes.shape({
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired,
    }),
  }),
  history: PropTypes.object,
  onPageClick: PropTypes.func.isRequired,
  maxItemsToDownload: PropTypes.number,
}

export default CollectionList
