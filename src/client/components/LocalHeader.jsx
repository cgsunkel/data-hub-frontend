import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GREY_4 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'
import Main from '@govuk-react/main'
import Breadcrumbs from '@govuk-react/breadcrumbs'
import { typography } from '@govuk-react/lib'

const StyledHeader = styled('header')`
  padding-bottom: ${SPACING.SCALE_5};
  background-color: ${GREY_4};
  padding-top: ${SPACING.SCALE_3};
`

const StyledMain = styled(Main)`
  padding-top: 0;
`

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin-bottom: ${SPACING.SCALE_5};
  margin-top: 0;
`

const StyledH1 = styled('h1')`
  ${typography.font({ size: 36, weight: 'bold' })};
`

const LocalHeader = ({ breadcrumbs, heading, children }) => (
  <StyledHeader aria-label="local header" data-auto-id="localHeader">
    <StyledMain>
      <BreadcrumbsWrapper>
        {breadcrumbs?.map((breadcrumb) =>
          breadcrumb.link ? (
            <Breadcrumbs.Link key={breadcrumb.link} href={breadcrumb.link}>
              {breadcrumb.text}
            </Breadcrumbs.Link>
          ) : (
            breadcrumb.text
          )
        )}
      </BreadcrumbsWrapper>
      {heading && <StyledH1>{heading}</StyledH1>}
      {children}
    </StyledMain>
  </StyledHeader>
)

LocalHeader.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      text: PropTypes.string.isRequired,
    })
  ),
  heading: PropTypes.string,
  children: PropTypes.node,
}

LocalHeader.defaultProps = {
  breadcrumbs: null,
  heading: null,
  children: null,
}

export default LocalHeader
