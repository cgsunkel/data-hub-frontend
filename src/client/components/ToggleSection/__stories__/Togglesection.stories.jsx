import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions/dist'
import Button from '@govuk-react/button'

import FieldInput from '../../Form/elements/FieldInput'
import FormStateful from '../../Form/FormStateful'

import ToggleSection from 'ToggleSection'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

const ToggleWithState = (props) => {
  const [isStateOpen, setStateIsOpen] = useState(props.isOpen)

  const handleClick = () => {
    setStateIsOpen(!isStateOpen)
  }

  return <ToggleSection {...props} onClick={handleClick} isOpen={isStateOpen} />
}

storiesOf('ToggleSection', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Single', () => (
    <ToggleWithState label="Toggle me">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </ToggleWithState>
  ))
  .add('Multiple', () => (
    <>
      <ToggleWithState label="Toggle me one">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </ToggleWithState>
      <ToggleWithState label="Toggle me two" isOpen={true}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </ToggleWithState>
    </>
  ))
  .add('Form elements', () => (
    <ToggleWithState label="Toggle me">
      <FormStateful onSubmit={action('onSubmit')}>
        {() => (
          <>
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
            <Button>Submit</Button>
          </>
        )}
      </FormStateful>
    </ToggleWithState>
  ))
