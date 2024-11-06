import dotenv from 'dotenv'
import { RequestHandler } from 'express'
import { createError } from '../lib'
import { FormModel } from '../models'
import type { TFormCreationAttributes } from '../types'

dotenv.config()

const createForm: RequestHandler = async (req, res, next) => {
  try {
    res.locals.form = await FormModel.create({
      status: 'initializing',
    } as TFormCreationAttributes)
    return next()
  } catch (err) {
    return next(createError({
      err: err as Error,
      method: `${__filename}:createForm`,
      status: 500,
    }))
  }
}

const getForm: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params

    const form = await FormModel.findOne({
      where: {
        id,
        ...(res.locals.showDeleted ? {} : { isDeleted: false }),
      },
    })

    if (!form) {
      return next(createError({
        err: 'Form not found',
        method: `${__filename}:getForm`,
        status: 404,
      }))
    }

    if (!res.locals.showDeleted && form.isDeleted) {
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
      err: err as Error,
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
