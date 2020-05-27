var pipelineItemLambdaPlc = require('../../../fixtures/v4/pipeline-item/pipeline-item-lambda-plc.json')
var pipelineNoResult = require('../../../fixtures/v4/pipeline-item/pipeline-item-no-results.json')
var pipelineCreate = require('../../../fixtures/v4/pipeline-item/pipeline-item-create.json')
var lambdaPlc = require('../../../fixtures/v4/company/company-lambda-plc.json')
var leads = require('../../../fixtures/v4/pipeline-item/leads.json')
var inProgress = require('../../../fixtures/v4/pipeline-item/in-progress.json')
var win = require('../../../fixtures/v4/pipeline-item/win.json')

exports.getPipelineItems = function(req, res) {
  if (req.query.company_id === lambdaPlc.id) {
    res.json(pipelineItemLambdaPlc)
    return
  }
  if (req.query.status === 'leads') {
    res.json(leads)
    return
  }
  if (req.query.status === 'in_progress') {
    res.json(inProgress)
    return
  }
  if (req.query.status === 'win') {
    res.json(win)
    return
  }
  res.json(pipelineNoResult)
}

exports.createUpdatePipelineItem = function(req, res) {
  var company = _.assign({}, pipelineCreate.company, {
    id: lambdaPlc.id,
    name: lambdaPlc.name,
  })
  var json = _.assign({}, pipelineCreate, {
    status: req.body.status,
    name: req.body.name,
    company: company,
  })
  res.json(json)
}

exports.getPipelineItem = function(req, res) {
  var pipelineItem = pipelineItemLambdaPlc.results[0]
  if (req.params.pipelineItemId === pipelineItem.id) {
    res.json(pipelineItem)
    return
  }
  if (req.params.pipelineItemId === 'LEADS') {
    res.json(
      _.assign({}, pipelineCreate, {
        status: 'leads',
      })
    )
    return
  }
  if (req.params.pipelineItemId === 'IN_PROGRESS') {
    res.json(
      _.assign({}, pipelineCreate, {
        status: 'in_progress',
      })
    )
    return
  }
  if (req.params.pipelineItemId === 'WIN') {
    res.json(
      _.assign({}, pipelineCreate, {
        status: 'win',
      })
    )
    return
  }
  res.send(404)
}
