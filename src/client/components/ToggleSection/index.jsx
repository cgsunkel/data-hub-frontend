import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLUE } from 'govuk-colours'
import { FONT_SIZE } from '@govuk-react/constants'
import icon from './assets/search-gov.uk.svg'

const ToggleContainer = styled('div')`
  margin-bottom: 10px;
`

const StyledDiv = styled('div')`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  > * {
    margin-top: 0;
  }
`

const StyledButton = styled('button')`
  display: inline-table;
  background: transparent;
  border: none;
  font-size: ${FONT_SIZE.SIZE_19};
  color: ${BLUE};
  padding: 0 0 10px 0;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    outline: none;
    text-decoration: underline;
  }
  &::before {
    display: table-cell;
    content: '';
    background: url(${icon}) 0 0 no-repeat;
    width: 30px;
    height: 30px;
    transform: ${({ isOpen }) => (isOpen ? `rotate(0deg)` : `rotate(180deg)`)};
  }
  span {
    display: table-cell;
    vertical-align: middle;
  }
`

const ToggleSection = ({ label, onClick, isOpen = false, children }) => {
  const id = label
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
  return (
    <ToggleContainer>
      <StyledButton
        onClick={onClick}
        isOpen={isOpen}
        aria-expanded={isOpen}
        aria-controls={id}
      >
        <span>{label}</span>
      </StyledButton>
      <StyledDiv isOpen={isOpen} id={id}>
        {children}
      </StyledDiv>
    </ToggleContainer>
  )
}

ToggleSection.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default ToggleSection
