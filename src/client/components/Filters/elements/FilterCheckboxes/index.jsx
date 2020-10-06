import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@govuk-react/checkbox'
import MultiChoice from '@govuk-react/multi-choice'
import { BODY_SIZES } from '@govuk-react/constants'
import styled from 'styled-components'

import { FilterFieldWrapper } from '../../../../components'
import Task from '../../../../components/Task'

const StyledCheckbox = styled(Checkbox)`
  ${(props) =>
    props.reduced &&
    `
      padding: 8px 0 8px 33px !important;
      min-height: auto;
      margin-bottom: 1px;

      input {
        width: 18px;
        height: 18px;
      }
      input + span {
        padding: 0;
        &:before {
          margin: 8px 0 0 8px;
          height: 18px;
          width: 18px;
          border-width: 1px;
        }
        &:after{
          border-width: 0 0 2px 2px;
          width: 10px;
          height: 5px;
          left: 11px;
        }
      }
      input + span + span {
        padding-left: 0;
        font-size: ${BODY_SIZES.S}px;
      }
    `}
`

const FilterCheckboxes = ({
  name,
  label = '',
  taskProps,
  hint = '',
  onChange,
  options = [],
  value = '',
}) => {
  return (
    <FilterFieldWrapper label={label} name={name} hint={hint}>
      <Task.Status {...taskProps}>
        {() => (
          <MultiChoice>
            {options.map(
              ({
                value: optionValue,
                label: optionLabel,
                children,
                ...optionProps
              }) => (
                <>
                  <StyledCheckbox
                    key={optionValue}
                    name={name}
                    value={optionValue}
                    onChange={onChange}
                    aria-label={optionLabel}
                    {...optionProps}
                  >
                    {optionLabel}
                  </StyledCheckbox>

                  {value.includes(optionValue) && !!children ? children : null}
                </>
              )
            )}
          </MultiChoice>
        )}
      </Task.Status>
    </FilterFieldWrapper>
  )
}

FilterCheckboxes.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  taskProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default FilterCheckboxes
