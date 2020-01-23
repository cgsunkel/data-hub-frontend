/**
 * This module is a registry of all Redux action types used within the app.
 * Redux actions are shared by all components/reducers so their names must not
 * collide. Having them defined as constants in a single module is a simple
 * measure to prevent such hard to debug cases.
 *
 * The name and value of the constants must be the same.
 * The name should be the name of the component the action relates to and a verb
 * describing what it does, concattenated by double underscore.
 */
export const COMPANY_LIST_VIEWER__LIST_CHANGE =
  'COMPANY_LIST_VIEWER__LIST_CHANGE'
export const COMPANY_LIST_VIEWER__FILTER = 'COMPANY_LIST_VIEWER__FILTER'
export const COMPANY_LIST_VIEWER__ORDER = 'COMPANY_LIST_VIEWER__ORDER'

export const COMPANY_LIST_2__LISTS_LOADED = 'COMPANY_LIST_2__LISTS_LOADED'
export const COMPANY_LIST_2__SELECT = 'COMPANY_LIST_2__SELECT'
export const COMPANY_LIST_2__COMPANIES_LOADED =
  'COMPANY_LIST_2__COMPANIES_LOADED'
export const COMPANY_LIST_2__FILTER = 'COMPANY_LIST_2__FILTER'
export const COMPANY_LIST_2__ORDER = 'COMPANY_LIST_2__ORDER'

export const TASK__START = 'TASK__START'
export const TASK__PROGRESS = 'TASK__PROGRESS'
export const TASK__ERROR = 'TASK__ERROR'
export const TASK__CLEAR = 'TASK__CLEAR'
