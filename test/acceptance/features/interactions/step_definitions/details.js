const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')

const Interaction = client.page.interactions.interaction()

Then(/^the interaction details Documents link is displayed$/, async function () {
  await Interaction
    .section.details
    .assert.visible('@documentsLink')
})

Then(/^the interaction details Documents link is not displayed$/, async function () {
  await Interaction
    .section.details
    .assert.elementNotPresent('@documentsLink')
})

Then('I see the service delivery details', async function () {
  const button = Interaction.getButtonSelectorWithText('Edit service delivery')

  await Interaction
    .api.useXpath()
    .assert.visible(button.selector)
    .useCss()
})
