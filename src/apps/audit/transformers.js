/* eslint camelcase: 0 */
const { get } = require('lodash')
const dateFns = require('date-fns')
const { DATE_TIME_MEDIUM_FORMAT } = require('../../common/constants')

function transformChanges(changes, labels) {
  return Object.keys(changes)
    .map((key) => labels[key] || key)
    .join(', ')
}

function getChangeCountDisplay(changeCount) {
  if (changeCount === 0) {
    return 'No changes saved'
  }

  if (changeCount === 1) {
    return `${changeCount} change`
  }

  return `${changeCount} changes`
}

function transformAuditLogToListItem(labels = {}) {
  return function transformAuditLogItem(logEntry) {
    const changeCount =
      (logEntry.changes && Object.keys(logEntry.changes).length) || 0

    return {
      type: 'audit',
      name: dateFns.format(logEntry.timestamp, DATE_TIME_MEDIUM_FORMAT),
      contentMetaModifier: 'stacked',
      meta: [
        {
          label: 'Adviser',
          value: get(logEntry, 'user.name') || 'Unknown adviser',
        },
        {
          label: 'Change count',
          type: 'badge',
          value: getChangeCountDisplay(changeCount),
        },
        {
          label: 'Fields',
          value: transformChanges(logEntry.changes, labels),
        },
      ],
    }
  }
}

module.exports = {
  transformAuditLogToListItem,
}
