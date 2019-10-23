require('@uktrade/datahub-header/component/header')
require('core-js/fn/array/from')
require('core-js/fn/promise')
require('element-closest')
require('classlist.js')

const ConditionalSubfields = require('./modules/conditional-subfields')
const SortableTable = require('./modules/sortable-table')
const LabelSelect = require('./modules/label-select')
const ArchiveForm = require('./modules/archive-form')
const Messages = require('./modules/messages')
const ErrorSummary = require('./modules/error-summary')
const AutoSubmit = require('./modules/auto-submit')
const AddItems = require('./modules/add-items')
const PrintDialog = require('./modules/print-dialog')
const MirrorValue = require('./modules/mirror-value.js')
const ClearInputs = require('./modules/clear-inputs.js')
const PreventMultipleSubmits = require('./modules/prevent-multiple-submits.js')
const PreventLinkDoubleClick = require('./modules/prevent-link-double-click.js')

LastInteractionFilter.init()// register before AutoSubmit so it should add the params before getting submitted
LabelSelect.init()
ConditionalSubfields.init()
SortableTable.init()
ArchiveForm.init()
Messages.init()
ErrorSummary.init()
AutoSubmit.init()
AddItems.init()
PrintDialog.init()
MirrorValue.init()
ClearInputs.init()
PreventMultipleSubmits.init()
PreventLinkDoubleClick.init()

// Deprecated
require('./_deprecated/company-add').init()
require('./_deprecated/lookup-address')
