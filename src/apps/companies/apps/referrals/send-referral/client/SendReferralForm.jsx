import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'
import axios from 'axios'

import SendReferralConfirmation from './SendReferralConfirmation'
import styled from 'styled-components'
import {
  SEND_REFERRAL_FORM__CONTINUE,
  SEND_REFERRAL_FORM__BACK,
  SEND_REFERRAL_FORM__ERROR,
  SEND_REFERRAL_FORM__SUBJECT_CHANGE,
  SEND_REFERRAL_FORM__ADVISER_CHANGE,
  SEND_REFERRAL_FORM__CONTACT_CHANGE,
  SEND_REFERRAL_FORM__TEXTAREA_CHANGE,
} from '../../../../../../client/actions'
import { FormActions, Typeahead } from 'data-hub-components'
import {
  H4,
  Label,
  Button,
  Link,
  HintText,
  ErrorText,
  LabelText,
  TextArea,
} from 'govuk-react'

import { MEDIA_QUERIES } from '@govuk-react/constants'
import InputField from '@govuk-react/input-field'

const StyledTextArea = styled(TextArea)({
  textarea: {
    [MEDIA_QUERIES.LARGESCREEN]: {
      width: '100%',
    },
  },
})

// Override the unecessary outlining of text within the input

const StyledTypeahead = styled(Typeahead)`
  input:focus {
    box-shadow: none;
  }
`

const SendReferralForm = ({
  companyContacts,
  cancelUrl,
  onContinue,
  onError,
  subject,
  notes,
  contact,
  adviser,
  emptyFields = [],
  onAdviserChange,
  onContactChange,
}) => {
  const emptyAdviserError = emptyFields.includes('adviser')
  const emptySubjectError = emptyFields.includes('subject')
  const emptyNotesError = emptyFields.includes('notes')
  const MAX_LENGTH = 255

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const emptyFields = [
          (!event?.target?.subject?.value ||
            event?.target?.subject?.value?.length >= MAX_LENGTH) &&
            'subject',
          !adviser && 'adviser',
          !event.target.notes.value && 'notes',
        ].filter(Boolean)
        emptyFields.length
          ? onError(emptyFields)
          : onContinue({
              adviser,
              subject: event.target.subject.value,
              notes: event.target.notes.value,
              contact,
            })
      }}
    >
      <H4>Who do you want to refer this company to?</H4>
      <Label error={emptyAdviserError}>
        <LabelText>Adviser</LabelText>
        {emptyAdviserError && (
          <ErrorText>Select an adviser for the referral</ErrorText>
        )}
        <HintText>
          This can be an adviser at post, a sector specialist or an
          international trade advisor. If you're not sure, you can{' '}
          <a href="https://people.trade.gov.uk/teams/department-for-international-trade">
            find the right team and person on Digital Workspace
          </a>
          .
        </HintText>
        <StyledTypeahead
          onChange={(event) =>
            onAdviserChange({
              name: event.label,
              id: event.value,
            })
          }
          error={emptyAdviserError}
          defaultValue={adviser && { label: adviser.name }}
          placeholder="Search for an adviser"
          name="adviser"
          loadOptions={throttle(
            (searchString) =>
              axios
                .get('/api-proxy/adviser/', {
                  params: {
                    autocomplete: searchString,
                    permission__has: 'company_referral.change_companyreferral',
                  },
                })
                .then(({ data: { results } }) =>
                  results
                    .filter((adviser) => adviser?.name.trim().length)
                    .map(({ id, name, dit_team }) => ({
                      label: `${name}${dit_team ? ', ' + dit_team.name : ''}`,
                      value: id,
                    }))
                ),
            500
          )}
        />
      </Label>
      <br />
      <H4>Referral notes</H4>
      <InputField
        meta={{
          touched: true,
          error:
            emptySubjectError &&
            `Enter a subject for the referral (Max ${MAX_LENGTH} characters)`,
        }}
        input={{ name: 'subject', defaultValue: subject }}
      >
        Subject
      </InputField>
      <br />
      <StyledTextArea
        hint="Include reasons you're referring this company and any specific opportunities."
        meta={{
          touched: true,
          error: emptyNotesError && 'Enter notes for the referral',
        }}
        input={{ name: 'notes', defaultValue: notes }}
      >
        Notes
      </StyledTextArea>
      <br />
      <Label>
        <LabelText>Company contact (optional)</LabelText>
        <HintText>Who should the recipient of the referral talk to?</HintText>
        <StyledTypeahead
          isMulti={false}
          isClearable={true}
          name="contact"
          options={companyContacts.map((contact) => ({
            label: contact.name,
            value: contact.id,
          }))}
          noOptionsMessage={() => 'This company has no contacts'}
          onChange={(selectedOption) =>
            onContactChange(
              selectedOption && {
                name: selectedOption.label,
                id: selectedOption.value,
              }
            )
          }
          defaultValue={contact && { label: contact.name }}
          placeholder="Select a contact"
          /* When a contact is removed a warning may appear stating the component switches between controlled
          and uncontrolled (despite the value being controlled by an onChange).
          The react-select library, used for the typeahead component, doesn't provide a way of controlling
          the input value under the hood and a fix for the warning couldn't be found.
          */
        />
      </Label>
      <br />
      <FormActions>
        <Button>Continue</Button>
        <Link href={cancelUrl}>Cancel</Link>
      </FormActions>
    </form>
  )
}

SendReferralForm.propTypes = {
  companyContacts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
    })
  ),
  cancelUrl: PropTypes.string.isRequired,
}

export default connect(
  (state) => ({
    ...state.sendReferral,
  }),
  (dispatch) => ({
    onError: (emptyFields) => {
      dispatch({
        type: SEND_REFERRAL_FORM__ERROR,
        emptyFields,
      })
    },
    onAdviserChange: (adviser) => {
      dispatch({
        type: SEND_REFERRAL_FORM__ADVISER_CHANGE,
        adviser,
      })
    },
    onSubjectChange: () => {
      dispatch({
        type: SEND_REFERRAL_FORM__SUBJECT_CHANGE,
      })
    },
    onTextAreaChange: () => {
      dispatch({
        type: SEND_REFERRAL_FORM__TEXTAREA_CHANGE,
      })
    },
    onContactChange: (contact) => {
      dispatch({
        type: SEND_REFERRAL_FORM__CONTACT_CHANGE,
        contact,
      })
    },
    onContinue: (formData) => {
      dispatch({
        type: SEND_REFERRAL_FORM__CONTINUE,
        ...formData,
      })
    },
    onBack: () =>
      dispatch({
        type: SEND_REFERRAL_FORM__BACK,
      }),
  })
)(({ confirm, ...props }) =>
  confirm ? (
    <SendReferralConfirmation {...props} />
  ) : (
    <SendReferralForm {...props} />
  )
)
