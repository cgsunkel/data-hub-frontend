import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { PipeLineItemPropType } from './types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { SPACING, MEDIA_QUERIES, FONT_SIZE } from '@govuk-react/constants'
import { BLUE } from 'govuk-colours'
import {
  Card,
  CardDetailsList,
} from 'data-hub-components/dist/activity-feed/activities/card'
import { NumberUtils } from 'data-hub-components'

import urls from '../../../lib/urls'
import Tag from '../Tag'
import LIKELIHOOD_TO_SUCCEED from './constants'

const StyledH3 = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_27};
  font-weight: bold;
  margin-bottom: ${SPACING.SCALE_2};
`

const StyledGridCol = styled(GridCol)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  a {
    margin: ${SPACING.SCALE_3} 0 0 0;
  }
  ${MEDIA_QUERIES.TABLET} {
    align-items: flex-end;
  }
`
const StyledGridValue = styled(GridCol)`
  flex: 1;
  margin-top: ${SPACING.SCALE_1};
  ${MEDIA_QUERIES.TABLET} {
    margin-top: 0;
  }
  a {
    text-decoration-line: none;
  }
`
const StyledGridLabel = styled(StyledGridValue)`
  font-weight: bold;
  margin-top: ${SPACING.SCALE_2};
  ${MEDIA_QUERIES.TABLET} {
    flex: 0 0 200px;
    margin-top: 0;
  }
`

const StyledGridRow = styled(GridRow)`
  padding-top: ${SPACING.SCALE_3};

  ${MEDIA_QUERIES.TABLET} {
    padding-top: 0;
  }
`

const StyledTagSpacing = styled.span`
  margin: ${SPACING.SCALE_3} 0 0 0;
  ${MEDIA_QUERIES.TABLET} {
    margin: 0;
  }
  & > span {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }
`

function buildMetaList({
  company,
  potential_value,
  sector,
  contact,
  expected_win_date,
  created_on,
}) {
  const list = [
    {
      id: 0,
      label: 'Company',
      value: company.name,
      href: urls.companies.detail(company.id),
    },
    sector && { id: 1, label: 'Project sector', value: sector.segment },
    contact && { id: 2, label: 'Company contact', value: contact.name },
    potential_value && {
      id: 3,
      label: 'Potential export value',
      value: NumberUtils.currencyGBP(potential_value),
    },
    expected_win_date && {
      id: 4,
      label: 'Expected date for win',
      value: moment(expected_win_date).format('MMM Y'),
    },
    {
      id: 5,
      label: 'Created',
      value: moment(created_on).format('DD MMM Y'),
    },
  ]
  // remove falsy values
  return list.filter(Boolean)
}

const PipelineItemMeta = ({ label, value, href }) => (
  <GridRow>
    <StyledGridLabel>{label}</StyledGridLabel>
    {href ? (
      <StyledGridValue>
        <Link href={href}>{value}</Link>
      </StyledGridValue>
    ) : (
      <StyledGridValue>{value}</StyledGridValue>
    )}
  </GridRow>
)

const PipelineItem = ({ item: { id, name, likelihood_to_win, ...meta } }) => (
  <Card>
    <StyledH3>{name}</StyledH3>
    <StyledGridRow>
      <GridCol>
        <CardDetailsList
          itemRenderer={(metaItem) => <PipelineItemMeta {...metaItem} />}
          items={buildMetaList({ ...meta })}
        />
      </GridCol>
      <StyledGridCol>
        {LIKELIHOOD_TO_SUCCEED[likelihood_to_win] && (
          <StyledTagSpacing aria-label="Likelihood to succeed">
            <Tag
              colour={LIKELIHOOD_TO_SUCCEED[likelihood_to_win].colour}
            >{`${LIKELIHOOD_TO_SUCCEED[likelihood_to_win].text}`}</Tag>
          </StyledTagSpacing>
        )}
        <Button as={Link} href={urls.pipeline.edit(id)} buttonColour={BLUE}>
          Edit
        </Button>
      </StyledGridCol>
    </StyledGridRow>
  </Card>
)

PipelineItem.propTypes = {
  item: PipeLineItemPropType,
}

export default PipelineItem
