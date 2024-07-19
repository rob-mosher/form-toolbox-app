import dotenv from 'dotenv'
import { RequestHandler } from 'express'
import { Form } from '../models'
import { createError } from '../utils/error'

dotenv.config()

const createForm: RequestHandler = async (req, res, next) => {
  try {
    res.locals.form = await Form.create({
      status: 'initialized',
    })
    return next()
  } catch (err) {
    return next(createError({
      err,
      method: `${__filename}:createForm`,
      status: 500,
    }))
  }
}

const getForm: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params

    const form = await Form.findByPk(id)

    if (!form) {
      return next(createError({
        err: 'Form not found',
        method: `${__filename}:getForm`,
        status: 404,
      }))
    }

    // @ts-expect-error TODO refactor with an all-container type solution
    if (!res.locals.allowDeleted && form.isDeleted) {
      return next(createError({
        err: 'Form is marked as deleted',
        method: `${__filename}:getForm`,
        status: 404,
      }))
    }

    res.locals.form = form
    return next()
  } catch (err) {
    return next(createError({
      err,
      method: `${__filename}:getForm`,
      status: 500,
    }))
  }
}

const formController = {
  createForm,
  getForm,
}

export default formController
