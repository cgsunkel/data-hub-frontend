import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'

const CollectionDownloadMessage = ({
  totalItems,
  collectionName,
  maxItemsToDownload = 5000,
}) => {
  const itemPlural = pluralize.plural(collectionName)
  const itemPluralWithCount = pluralize(collectionName, totalItems, true)
  if (totalItems === 0) {
    return <>{`There are no ${itemPlural} to download`}</>
  } else if (totalItems <= maxItemsToDownload) {
    return <>{`You can now download ${itemPluralWithCount}`}</>
  } else {
    return (
      <>{`Filter to fewer than ${maxItemsToDownload} ${itemPlural} to download`}</>
    )
  }
}

CollectionDownloadMessage.propTypes = {
  maxItemsToDownload: PropTypes.number,
  totalItems: PropTypes.number.isRequired,
  collectionName: PropTypes.string.isRequired,
}

export default CollectionDownloadMessage
