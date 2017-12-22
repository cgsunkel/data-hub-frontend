const router = require('express').Router()

const { setHomeBreadcrumb } = require('../middleware')
const { setOrder, setOrderBreadcrumb } = require('./middleware')
const viewApp = require('./apps/view')
const editApp = require('./apps/edit')
const createApp = require('./apps/create')
const listApp = require('./apps/list')

router.param('orderId', setOrder)

router.use(listApp.mountpath, listApp.router)
router.use(createApp.mountpath, setHomeBreadcrumb(createApp.displayName), createApp.router)
router.use(editApp.mountpath, setOrderBreadcrumb, editApp.router)
router.use(viewApp.mountpath, viewApp.router)

module.exports = router
