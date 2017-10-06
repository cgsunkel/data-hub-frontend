const {
  find,
  flatten,
  get,
  isNull,
  isPlainObject,
  isUndefined,
  map,
  mapValues,
  pick,
  pickBy,
} = require('lodash')
const dateFns = require('date-fns')

const { longDateFormat } = require('../../../../config')
const FormController = require('./form')
const { Order } = require('../models')

class EditController extends FormController {
  async successHandler (req, res, next) {
    const data = pick(req.sessionModel.toJSON(), Object.keys(req.form.options.fields))

    try {
      const order = await Order.update(req.session.token, res.locals.order.id, data)
      const nextUrl = req.form.options.next || `/omis/${order.id}`

      req.journeyModel.reset()
      req.journeyModel.destroy()
      req.sessionModel.reset()
      req.sessionModel.destroy()

      req.flash('success', 'Order updated')
      res.redirect(nextUrl)
    } catch (error) {
      next(error)
    }
  }

  getValues (req, res, next) {
    const sessionValues = req.sessionModel.toJSON()
    const errorValues = pick(sessionValues.errorValues, Object.keys(req.form.options.fields))

    delete sessionValues.errorValues
    delete sessionValues.errors

    const orderValues = mapValues(req.form.options.fields, (fieldOptions, key) => {
      const newValue = get(res.locals, `order.${key}`)

      if (isPlainObject(newValue)) {
        return get(newValue, 'id')
      }

      if (find(newValue, 'id')) {
        return map(newValue, 'id')
      }

      if (find(newValue, 'adviser')) {
        return map(newValue, 'adviser.id')
      }

      if (fieldOptions.repeatable) {
        return flatten([newValue])
      }

      return newValue
    })

    const exemptFields = ['vat_number', 'po_number']
    // combine order values and error values
    let combinedValues = Object.assign({}, orderValues, sessionValues, errorValues)
    // convert dates to default format
    combinedValues = mapValues(combinedValues, (value, key) => {
      if (typeof value === 'string' && !exemptFields.includes(key)) {
        const parsedDate = dateFns.parse(value.toString())
        if (dateFns.isValid(parsedDate)) {
          return dateFns.format(parsedDate, longDateFormat)
        }
      }

      return value
    })

    const filtered = pickBy(combinedValues, (value) => {
      return !isUndefined(value) && !isNull(value)
    })

    next(null, filtered)
  }
}

module.exports = EditController
