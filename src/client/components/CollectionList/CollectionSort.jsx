import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import { GREY_1 } from 'govuk-colours'

import CollectionHeaderRow from './CollectionHeaderRow'
import Sort from '../Sort'

const StyledSpan = styled('span')`
  color: ${GREY_1};
`

const CollectionSort = ({
  onFilterChange,
  sortOptions,
  totalPages,
  history,
  filters,
  query,
}) => {
  const actions = (
    <>
      <Sort
        name="sortBy"
        label="Sort by"
        input={{ defaultValue: decodeURIComponent(query.sortby) }}
        onChange={(e) =>
          onFilterChange({ sortby: e.target.value }, history, null, filters)
        }
      >
        {sortOptions.map(({ name, value }, i) => {
          return (
            <option value={value} key={i}>
              {name}
            </option>
          )
        })}
      </Sort>
    </>
  )

  return (
    <CollectionHeaderRow actions={actions}>
      <StyledSpan>
        Page {query.page || 1} of {totalPages}
      </StyledSpan>
    </CollectionHeaderRow>
  )
}

CollectionSort.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalPages: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  filters: PropTypes.object,
  query: PropTypes.object,
}

export default CollectionSort
