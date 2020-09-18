import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { throttle } from 'lodash'
import { Typeahead, FieldWrapper } from '../../../../components'
import Task from '../../../../components/Task'

import parseAdviserData from '../../../../utils/formatAdviser'

const fetchAdvisers = (onlyShowActiveAdvisers) =>
  throttle(
    (searchString) =>
      axios
        .get('/api-proxy/adviser/', {
          params: {
            autocomplete: searchString,
            is_active: onlyShowActiveAdvisers,
          },
        })
        .then(({ data: { results } }) => parseAdviserData(results)),
    500
  )

const FilterAdvisersTypeAhead = ({
  task,
  name,
  label,
  required = false,
  isMulti = false,
  placeholder,
  onlyShowActiveAdvisers = true,
  noOptionsMessage,
  closeMenuOnSelect = false,
  onChange,
  selectedFilters,
}) => {
  return (
    <FieldWrapper label={label} name={name}>
      <Task.Status
        name={task.name}
        id={task.id}
        progressMessage={task.progressMessage}
        startOnRender={task.startOnRender}
      >
        {() => (
          <Typeahead
            name={name}
            placeholder={placeholder}
            noOptionsMessage={noOptionsMessage}
            closeMenuOnSelect={closeMenuOnSelect}
            required={required}
            loadOptions={fetchAdvisers(onlyShowActiveAdvisers)}
            isMulti={isMulti}
            onChange={onChange}
            value={selectedFilters?.advisers || null}
          />
        )}
      </Task.Status>
    </FieldWrapper>
  )
}

FilterAdvisersTypeAhead.propTypes = {
  name: PropTypes.string.isRequired,
}

export default FilterAdvisersTypeAhead
