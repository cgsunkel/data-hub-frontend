import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { isBoolean, isNumber } from 'lodash'
import { DateUtils, NumberUtils } from 'data-hub-components'
import { convertUsdToGbp } from '../../../../../common/currency'

import EditHistory from '../../../../../client/components/EditHistory/EditHistory'

import {
  ARCHIVED,
  NOT_ARCHIVED,
  YES,
  NO,
  AUTOMATIC_UPDATE,
  CHANGE_TYPE_TEXT,
  NOT_SET,
} from '../constants'

const CURRENCY_FIELDS = ['Turnover']

function isDate(dateStr) {
  return moment(dateStr, moment.ISO_8601, true).isValid()
}

function getValueFromBoolean(value, field) {
  if (
    field === 'Is number of employees estimated' ||
    field === 'Is turnover estimated'
  ) {
    return value ? YES : NO
  }

  if (field === 'Archived') {
    return value ? ARCHIVED : NOT_ARCHIVED
  }
}

function getValue(value, field) {
  if (isBoolean(value)) {
    return getValueFromBoolean(value, field)
  }

  if (isNumber(value)) {
    return CURRENCY_FIELDS.includes(field)
      ? NumberUtils.currencyGBP(convertUsdToGbp(value), {
          maximumSignificantDigits: 2,
        })
      : value.toString()
  }

  if (isDate(value)) {
    return DateUtils.formatWithTime(value)
  }

  return value || NOT_SET
}

function getUpdatedBy(timestamp, changedBy) {
  const formattedTime = DateUtils.formatWithTime(timestamp)
  return changedBy === AUTOMATIC_UPDATE
    ? `Automatically updated on ${formattedTime}`
    : `Updated on ${formattedTime} by ${changedBy}`
}

function CompanyEditHistory({ dataEndpoint }) {
  return (
    <EditHistory
      dataEndpoint={dataEndpoint}
      changeType={CHANGE_TYPE_TEXT}
      getUpdatedBy={getUpdatedBy}
      getValue={getValue}
    />
  )
}

CompanyEditHistory.propTypes = {
  dataEndpoint: PropTypes.string.isRequired,
}

export default CompanyEditHistory