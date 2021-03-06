/* eslint camelcase: 0 */
const moment = require('moment')

const formatHelpCentreAnnouncements = (feed = {}) => {
  const { articles = [] } = feed
  return articles.map((item) => {
    if (item.title && item.html_url && item.created_at) {
      return {
        heading: item.title,
        link: item.html_url,
        date: moment(item.created_at).fromNow(),
      }
    }
  })
}

module.exports = {
  formatHelpCentreAnnouncements,
}
