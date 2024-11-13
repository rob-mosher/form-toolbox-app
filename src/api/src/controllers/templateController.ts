import dotenv from 'dotenv'
import { RequestHandler } from 'express'
import { createError } from '../lib'
import { TemplateModel } from '../models'

dotenv.config()

const getTemplate: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params

    const template = await TemplateModel.findOne({
      where: {
        id,
        ...(res.locals.showDeleted ? {} : { isDeleted: false }),
      },
    })

    if (!template) {
      return next(createError({
        err: 'Form not found',
        method: `${__filename}:getForm`,
        status: 404,
      }))
    }

    if (!res.locals.showDeleted && template.isDeleted) {
      return next(createError({
        err: 'Template is marked as deleted',
        method: `${__filename}:getTemplate`,
        status: 404,
      }))
    }

    res.locals.template = template
    return next()
  } catch (err) {
    return next(createError({
      err: err as Error,
      method: `${__filename}:getTemplate`,
      status: 500,
    }))
  }
}

const updateTemplate: RequestHandler = async (req, res, next) => {
  const { updates } = req.body
  const allowedUpdates = new Set([
    'formSchemaOrder',
  ])

  try {
    if (!updates) {
      throw new Error('No update object was included in the request')
    }

    // Validate updates
    Object.keys(updates).forEach((key) => {
      if (!allowedUpdates.has(key)) {
        throw new Error(`Update to field '${key}' is not allowed`)
      }
    })

    // Update the template
    if (updates.formSchemaOrder) {
      const formSchemaOrder = updates.formSchemaOrder as string[]
      const schemaKeys = new Set(Object.keys(res.locals.template.formSchema))
      const orderKeys = new Set(formSchemaOrder)

      if (schemaKeys.size !== orderKeys.size) {
        throw new Error('Form schema order must include all schema fields')
      }

      const hasInvalidKey = Array.from(orderKeys).some((key) => !schemaKeys.has(key))
      if (hasInvalidKey) {
        throw new Error('Invalid field in order')
      }

      res.locals.template.formSchemaOrder = formSchemaOrder
    }

    if (!res.locals.template.changed()) {
      return res.sendStatus(200)
    }

    await res.locals.template.save()
    return res.sendStatus(200)
  } catch (err) {
    return next(createError({
      err: err as Error,
      method: `${__filename}:updateTemplate`,
      status: 400,
    }))
  }
}

const templateController = {
  getTemplate,
  updateTemplate,
}

export default templateController
