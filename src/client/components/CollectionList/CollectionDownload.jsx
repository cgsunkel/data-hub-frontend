import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import Link from '@govuk-react/link'
import CollectionDownloadMessage from './CollectionDownloadMessage'
import CollectionHeaderRow from './CollectionHeaderRow'
import { WHITE } from 'govuk-colours'

const StyledInnerText = styled('div')`
  width: 100%;
  line-height: 36px;
  ${MEDIA_QUERIES.TABLET} {
    width: 0;
    flex-grow: 1;
  }
`
// TODO: we need to lift this out to the button component, as we don't have a link styled as a button
const StyledButton = styled(Link)`
  font-size: 19px;
  font-weight: 400;
  display: inline-block;
  margin-bottom: 0;
  background-color: #00823b;
  padding: 7px 10px;
  box-shadow: 0 2px 0 #003418;
  &:link {
    color: ${WHITE};
    text-decoration: none;
  }
  &:hover {
    background-color: #00682f;
  }
  &:focus {
    background-color: #00823b;
    transition: box-shadow 0.1s, outline-color 0.1s 0.1s;
    box-shadow: 0 0 0 3px #ffbf47;
  }
`
const CollectionDownload = ({
  totalItems,
  collectionName,
  downloadUrl,
  search,
  maxItemsToDownload = 5000,
}) => {
  if (!downloadUrl) {
    return null
  }
  const canDownload = totalItems > 0 && totalItems <= maxItemsToDownload

  const actions = canDownload && (
    <StyledButton
      href={`${downloadUrl}s/export${decodeURIComponent(search)}`.toLowerCase()}
    >
      Download
    </StyledButton>
  )

  return (
    <CollectionHeaderRow actions={actions}>
      <StyledInnerText>
        <CollectionDownloadMessage
          totalItems={totalItems}
          collectionName={collectionName}
          maxItemsToDownload={maxItemsToDownload}
        />
      </StyledInnerText>
    </CollectionHeaderRow>
  )
}

CollectionDownload.propTypes = {
  totalItems: PropTypes.number.isRequired,
  collectionName: PropTypes.string.isRequired,
  downloadUrl: PropTypes.string.isRequired,
  search: PropTypes.string,
  maxItemsToDownload: PropTypes.number,
}

CollectionDownload.defaultProps = {
  downloadUrl: null,
}

export default CollectionDownload
