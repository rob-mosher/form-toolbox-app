import dotenv from 'dotenv'

import { NextFunction, Request, Response } from 'express'

import { createError } from '../utils/error'
import { Form } from '../models'

dotenv.config()

const createForm = async (req: Request, res: Response, next: NextFunction) => {
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

const getForm = async (req: Request, res: Response, next: NextFunction) => {
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
