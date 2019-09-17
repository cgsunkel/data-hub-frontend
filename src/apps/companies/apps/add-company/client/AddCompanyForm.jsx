/* eslint-disable camelcase */

import React, { useState } from 'react'
import axios from 'axios'
import {
  H3,
  LoadingBox,
  UnorderedList,
  ListItem,
  Details
} from 'govuk-react'
import PropTypes from 'prop-types'
import { compact, get } from 'lodash'

import {
  FieldDnbCompany,
  FieldInput,
  FieldRadios,
  FieldSelect,
  Form,
  Step
} from 'data-hub-components'

import DefinitionList from './DefinitionList'

const COMPANY_LOCATION_OPTIONS = {
  uk: {
    label: 'UK',
    value: 'uk',
  },
  overseas: {
    label: 'Overseas',
    value: 'overseas',
  },
}

function AddCompanyForm ({ host, csrfToken, foreignCountries, organisationTypes, regions, sectors }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  function getCountry ({ companyLocation, companyOverseasCountry }) {
    if (companyLocation && companyLocation === COMPANY_LOCATION_OPTIONS.uk.value) {
      return COMPANY_LOCATION_OPTIONS.uk.label
    }

    if (companyOverseasCountry) {
      return foreignCountries.find(c => c.value === companyOverseasCountry).label
    }
  }

  function getCompanyName ({ dnbCompany }) {
    return get(dnbCompany, 'primary_name')
  }

  function getCompanyAddress ({ dnbCompany }) {
    if (dnbCompany) {
      return compact([
        dnbCompany.address_line_1,
        dnbCompany.address_line_2,
        dnbCompany.address_town,
        dnbCompany.address_postcode,
      ]).join(', ')
    }
  }

  function getCompaniesHouseNumber ({ dnbCompany }) {
    if (dnbCompany) {
      const companiesHouseAccount = dnbCompany.registration_numbers
        .find(({ registration_type }) => registration_type === 'uk_companies_house_number')

      if (companiesHouseAccount) {
        return companiesHouseAccount.registration_number
      }
    }
  }

  async function onSubmit (values) {
    setIsSubmitting(true)

    if (values.cannotFind) {
      try {
        const { data } = await axios.post(`//${host}/companies/create/dnb/company-investigation?_csrf=${csrfToken}`, values)
        window.location.href = `//${host}/companies/${data.id}`
      } catch (error) {
        // handle error
      }
    } else {
      // handle can find
    }

    setIsSubmitting(false)
  }

  return (
    <Form onSubmit={onSubmit}>
      {form => (
        <LoadingBox loading={isSubmitting}>
          <Step name="companyLocation">
            <FieldRadios
              name="companyLocation"
              label={<H3>Where is this company based?</H3>}
              required="Specify location of the company"
              options={[
                COMPANY_LOCATION_OPTIONS.uk,
                {
                  ...COMPANY_LOCATION_OPTIONS.overseas,
                  children: (
                    <FieldSelect
                      required="Select in which country the company is based"
                      label="Country"
                      name="companyOverseasCountry"
                      options={foreignCountries}
                    />
                  ),
                },
              ]}
            />
          </Step>

          <Step name="companySearch" hideForwardButton={true}>
            <H3>Find the company</H3>

            <FieldDnbCompany
              apiEndpoint={`//${host}/companies/create/dnb/company-search?_csrf=${csrfToken}`}
              country={getCountry(form.values)}
              name="dnbCompany"
            />
          </Step>

          {!form.values.cannotFind && (
            <Step name="companyDetails" forwardButtonText="Add company">
              <H3>Confirm you want to add this company to Data Hub</H3>

              <DefinitionList header={getCompanyName(form.values)}>
                <DefinitionList.Row
                  label="Companies House number"
                  description={getCompaniesHouseNumber(form.values)}
                />
                <DefinitionList.Row
                  label="Address"
                  description={getCompanyAddress(form.values)}
                />
              </DefinitionList>
            </Step>
          )}

          {form.values.cannotFind && (
            <Step name="unhappy" forwardButtonText="Add company">

              <Details summary="Why am I seeing this?">
                The company you want to add to Data Hub cannot be found in the external databases Data Hub checks.
                You will need to provide information about the company, so the company can be added to Data Hub
                while the Data Hub support team checks with the company the information you have provided.
              </Details>

              <FieldRadios
                name="business_type"
                label="Organisation type"
                required="Select organisation"
                options={organisationTypes}
              />

              <FieldInput
                label="Name of company"
                name="name"
                required="Enter name"
                type="text"
              />

              <FieldInput
                label="Company's website"
                name="website"
                required="Enter website"
                type="text"
              />

              <FieldInput
                label="Company's telephone number"
                name="telephone_number"
                type="text"
              />

              <FieldSelect
                name="uk_region"
                label="DIT region"
                emptyOption="-- Select DIT region --"
                options={regions}
                required="Select DIT region"
              />

              <FieldSelect
                name="sector"
                label="DIT sector"
                emptyOption="-- Select DIT sector --"
                options={sectors}
                required="Select DIT sector"
              />

              <H3>What happens next</H3>
              <p>
                You are requesting that a new company be added to Data Hub. Once you select the ‘Add company’ button below:
                <UnorderedList>
                  <ListItem>
                    you can continue to record interactions with the company
                  </ListItem>
                  <ListItem>
                    Data Hub’s external data provider will confirm with the company that the information on this page is correct
                  </ListItem>
                  <ListItem>
                    within 3 weeks the Data Hub support team will send you an email to tell you whether the information on this page has been confirmed
                  </ListItem>
                </UnorderedList>
              </p>

            </Step>
          )}

        </LoadingBox>
      )}
    </Form>
  )
}

AddCompanyForm.propTypes = {
  host: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
  foreignCountries: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  organisationTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  regions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  sectors: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
}

export default AddCompanyForm
