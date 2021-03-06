const { Router } = require('express')
const urls = require('../../lib/urls')

const { renderAddToPipeline } = require('./controllers/add')
const { renderEditPipeline } = require('./controllers/edit')
const { renderArchivePipelineItem } = require('./controllers/archive')
const { renderUnarchivePipelineItem } = require('./controllers/unarchive')
const { renderDeletePipelineItem } = require('./controllers/delete')

const companyPipelineRouter = Router()
const myPipelineRouter = Router()

companyPipelineRouter.get(urls.companies.pipelineAdd.route, renderAddToPipeline)

myPipelineRouter.get(urls.pipeline.edit.route, renderEditPipeline)
myPipelineRouter.get(urls.pipeline.archive.route, renderArchivePipelineItem)
myPipelineRouter.get(urls.pipeline.unarchive.route, renderUnarchivePipelineItem)
myPipelineRouter.get(urls.pipeline.delete.route, renderDeletePipelineItem)

module.exports = {
  companyPipelineRouter,
  myPipelineRouter,
}
