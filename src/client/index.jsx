import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter,
} from 'connected-react-router'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import createSagaMiddleware from 'redux-saga'

import AddCompanyForm from '../apps/companies/apps/add-company/client/AddCompanyForm'
import InteractionDetailsForm from '../apps/interactions/apps/details-form/client/InteractionDetailsForm'
import CompanyActivityFeed from '../apps/companies/apps/activity-feed/client/CompanyActivityFeed'
import EditCompanyForm from '../apps/companies/apps/edit-company/client/EditCompanyForm'
import CompanyEditHistory from '../apps/companies/apps/edit-history/client/CompanyEditHistory'
import FindCompany from '../apps/companies/apps/match-company/client/FindCompany'
import DeleteCompanyList from '../apps/company-lists/client/DeleteCompanyList'
import MatchConfirmation from '../apps/companies/apps/match-company/client/MatchConfirmation'
import CannotFindMatch from '../apps/companies/apps/match-company/client/CannotFindMatch'
import EditCompanyList from '../apps/company-lists/client/EditCompanyList'
import CreateListFormSection from '../apps/company-lists/client/CreateListFormSection'
import AddRemoveFromListSection from '../apps/company-lists/client/AddRemoveFromListSection'
import DnbHierarchy from '../apps/companies/apps/dnb-hierarchy/client/DnbHierarchy'
import LeadAdvisers from '../apps/companies/apps/advisers/client/LeadAdvisers'
import LargeCapitalProfileCollection from '../apps/investments/client/LargeCapitalProfileCollection'
import InvestmentEditHistory from '../apps/investments/client/InvestmentEditHistory'
import ManageAdviser from '../apps/companies/apps/advisers/client/ManageAdviser'
import CompanyBusinessDetails from '../apps/companies/apps/business-details/client/CompanyBusinessDetails'
import ExportsIndex from '../apps/companies/apps/exports/client/ExportsIndex'
import ExportsHistory from '../apps/companies/apps/exports/client/ExportsHistory/'
import ExportsEdit from '../apps/companies/apps/exports/client/ExportsEdit.jsx'
import ExportCountriesEdit from '../apps/companies/apps/exports/client/ExportCountriesEdit/'
import ReferralDetails from '../apps/companies/apps/referrals/details/client/ReferralDetails'
import ReferralHelp from '../apps/companies/apps/referrals/help/client/ReferralHelp'
import SendReferralForm from '../apps/companies/apps/referrals/send-referral/client/SendReferralForm'
import sendReferral from '../apps/companies/apps/referrals/send-referral/client/reducer'
import InteractionReferralDetails from '../apps/companies/apps/referrals/details/client/InteractionReferralDetails.jsx'
import AddToPipelineForm from '../apps/pipeline/client/AddToPipelineForm'

import tasksSaga from './components/Task/saga'
import tasks from './components/Task/reducer'

import { ID as COMPANY_LISTS_STATE_ID } from './components/CompanyLists/state'
import companyListsReducer from './components/CompanyLists/reducer'
import * as companyListsTasks from './components/CompanyLists/tasks'

import { ID as REFERRALS_DETAILS_STATE_ID } from '../apps/companies/apps/referrals/details/client/state'
import referralsReducer from '../apps/companies/apps/referrals/details/client/reducer'
import * as referralTasks from '../apps/companies/apps/referrals/details/client/tasks'

import { ID as EXPORTS_HISTORY_ID } from '../apps/companies/apps/exports/client/ExportsHistory/state'
import exportsHistoryReducer from '../apps/companies/apps/exports/client/ExportsHistory/reducer'
import * as exportsHistoryTasks from '../apps/companies/apps/exports/client/ExportsHistory/tasks'

import TabNav from './components/TabNav'
import referralListTask from './components/ReferralList/task'
import ReferralList from './components/ReferralList'
import Dashboard from './components/Dashboard'

import { ID as EXPORTS_WINS_ID } from '../apps/companies/apps/exports/client/ExportWins/state'
import exportWinsReducer from '../apps/companies/apps/exports/client/ExportWins/reducer'
import * as exportWinsTasks from '../apps/companies/apps/exports/client/ExportWins/tasks'

import Form from './components/Form'

import {
  ID as EXPORT_COUNTRIES_EDIT_ID,
  TASK_NAME as EXPORT_COUNTRIES_EDIT_NAME,
} from '../apps/companies/apps/exports/client/ExportCountriesEdit/state'
import exportCountriesEditReducer from '../apps/companies/apps/exports/client/ExportCountriesEdit/reducer'
import * as exportCountriesEditTasks from '../apps/companies/apps/exports/client/ExportCountriesEdit/tasks'

import * as addInteractionFormState from '../apps/interactions/apps/details-form/client/state'
import * as addInteractionFormTasks from '../apps/interactions/apps/details-form/client/tasks'
import addInteractionFormReducer from '../apps/interactions/apps/details-form/client/reducer'

import {
  ID as ADD_TO_PIPELINE_ID,
  TASK_NAME as ADD_TO_PIPELINE_TASK_NAME,
} from '../apps/pipeline/client/state'
import addToPipelineReducer from '../apps/pipeline/client/reducer'
import * as pipelineReducer from '../apps/pipeline/client/tasks'

const sagaMiddleware = createSagaMiddleware()
const history = createBrowserHistory({
  // The baseURI is set to the <base/> tag by the spaFallbackSpread
  // middleware, which should be applied to each Express route where
  // react-router is expected to be used.
  basename: new URL(
    document.baseURI ||
      // IE doesn't support baseURI so we need to access base.href manually
      document.querySelector('base')?.href ||
      document.location.href
  ).pathname,
})

const store = createStore(
  combineReducers({
    router: connectRouter(history),
    tasks,
    sendReferral,
    [COMPANY_LISTS_STATE_ID]: companyListsReducer,
    [EXPORTS_HISTORY_ID]: exportsHistoryReducer,
    [REFERRALS_DETAILS_STATE_ID]: referralsReducer,
    [EXPORTS_WINS_ID]: exportWinsReducer,
    [EXPORT_COUNTRIES_EDIT_ID]: exportCountriesEditReducer,
    [addInteractionFormState.ID]: addInteractionFormReducer,
    [ADD_TO_PIPELINE_ID]: addToPipelineReducer,
    ...TabNav.reducerSpread,
    ...ReferralList.reducerSpread,
    ...Form.reducerSpread,
    // A reducer is required to be able to set a preloadedState parameter
    referrerUrl: (state = {}) => state,
  }),
  {
    referrerUrl: window.document.referrer,
    Form: {
      [addInteractionFormState.ID]: {
        values: {},
        touched: {},
        errors: {},
        fields: {},
        steps: [],
        currentStep: 0,
        ...addInteractionFormTasks.restoreState(),
      },
    },
  },
  composeWithDevTools(
    applyMiddleware(sagaMiddleware, routerMiddleware(history))
  )
)

sagaMiddleware.run(
  tasksSaga({
    'Company lists': companyListsTasks.fetchCompanyLists,
    'Company list': companyListsTasks.fetchCompanyList,
    'Exports history': exportsHistoryTasks.fetchExportsHistory,
    'Referral details': referralTasks.fetchReferralDetails,
    Referrals: referralListTask,
    'Export wins': exportWinsTasks.fetchExportWins,
    [EXPORT_COUNTRIES_EDIT_NAME]: exportCountriesEditTasks.saveExportCountries,
    [addInteractionFormState.TASK_SAVE_INTERACTION]:
      addInteractionFormTasks.saveInteraction,
    [addInteractionFormState.TASK_OPEN_CONTACT_FORM]:
      addInteractionFormTasks.openContactForm,
    [ADD_TO_PIPELINE_TASK_NAME]: pipelineReducer.checkIfOnPipeline,
  })
)

const appWrapper = document.getElementById('react-app')

function parseProps(domNode) {
  return 'props' in domNode.dataset ? JSON.parse(domNode.dataset.props) : {}
}

function Mount({ selector, children }) {
  return [...document.querySelectorAll(selector)].map((domNode) => {
    const props = parseProps(domNode)
    return ReactDOM.createPortal(
      typeof children === 'function' ? children(props) : children,
      domNode
    )
  })
}

function App() {
  const globalProps = parseProps(appWrapper)
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Mount selector="#add-company-form">
          {(props) => (
            <AddCompanyForm csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#interaction-details-form">
          {(props) => (
            <InteractionDetailsForm
              csrfToken={globalProps.csrfToken}
              {...props}
            />
          )}
        </Mount>
        <Mount selector="#edit-company-form">
          {(props) => (
            <EditCompanyForm csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#company-edit-history">
          {(props) => (
            <CompanyEditHistory csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#investment-edit-history">
          {(props) => (
            <InvestmentEditHistory
              csrfToken={globalProps.csrfToken}
              {...props}
            />
          )}
        </Mount>
        <Mount selector="#match-confirmation">
          {(props) => (
            <MatchConfirmation csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#cannot-find-match">
          {(props) => (
            <CannotFindMatch csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#find-company">
          {(props) => (
            <FindCompany csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#activity-feed-app">
          {(props) => <CompanyActivityFeed {...props} />}
        </Mount>
        <Mount selector="#company-lists">
          <Dashboard id="homepage" />
        </Mount>
        <Mount selector="#delete-company-list">
          {(props) => (
            <DeleteCompanyList csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#edit-company-list">
          {(props) => (
            <EditCompanyList csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#create-company-list-form">
          {(props) => (
            <CreateListFormSection
              csrfToken={globalProps.csrfToken}
              {...props}
            />
          )}
        </Mount>
        <Mount selector="#add-remove-list-form">
          {(props) => <AddRemoveFromListSection {...props} />}
        </Mount>
        <Mount selector="#lead-advisers">
          {(props) => <LeadAdvisers {...props} />}
        </Mount>
        <Mount selector="#dnb-hierarchy">
          {(props) => <DnbHierarchy {...props} />}
        </Mount>
        <Mount selector="#company-business-details">
          {(props) => <CompanyBusinessDetails {...props} />}
        </Mount>
        <Mount selector="#large-capital-profile-collection">
          {(props) => <LargeCapitalProfileCollection {...props} />}
        </Mount>
        <Mount selector="#manage-adviser">
          {(props) => (
            <ManageAdviser {...props} csrfToken={globalProps.csrfToken} />
          )}
        </Mount>
        <Mount selector="#company-export-index-page">
          {(props) => <ExportsIndex {...props} />}
        </Mount>
        <Mount selector="#send-referral-form">
          {(props) => (
            <SendReferralForm {...props} csrfToken={globalProps.csrfToken} />
          )}
        </Mount>
        <Mount selector="#company-export-full-history">
          {(props) => <ExportsHistory {...props} />}
        </Mount>
        <Mount selector="#referral-details">
          {(props) => <ReferralDetails {...props} />}
        </Mount>
        <Mount selector="#referral-help">
          {(props) => <ReferralHelp {...props} />}
        </Mount>
        <Mount selector="#company-export-exports-edit">
          {(props) => <ExportsEdit {...props} />}
        </Mount>
        <Mount selector="#interaction-referral-details">
          {(props) => <InteractionReferralDetails {...props} />}
        </Mount>
        <Mount selector="#company-export-countries-edit">
          {(props) => <ExportCountriesEdit {...props} />}
        </Mount>
        <Mount selector="#add-to-pipeline-form">
          {(props) => <AddToPipelineForm {...props} />}
        </Mount>
      </ConnectedRouter>
    </Provider>
  )
}

ReactDOM.render(<App />, appWrapper)
