import express, { NextFunction, Request, Response } from 'express'
import { createError } from '../lib'
import { FormModel, TemplateModel } from '../models'

const templateRouter = express.Router()

// For efficiency, only include the id and name when providing all template.
templateRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = await TemplateModel.findAll({
      where: { isDeleted: false },
      attributes: ['id', 'name', 'formSchemaCount'],
    })
    return res.json(templates)
  } catch (err) {
    return next(createError({
      err: err as Error,
      method: `${__filename}:templateRouter.get /`,
      status: 500,
    }))
  }
})

templateRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    const template = await TemplateModel.findOne({
      attributes: ['id', 'formSchema', 'formSchemaCount', 'name'],
      where: {
        id,
        isDeleted: false,
      },
    })

    if (!template) {
      return next(createError({
        err: 'Template not found',
        method: `${__filename}:templateRouter.get /:id`,
        status: 404,
      }))
    }

    return res.json(template)
  } catch (err) {
    return next(createError({
      err: err as Error,
      method: `${__filename}:templateRouter.get /:id`,
      status: 500,
    }))
  }
})

templateRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    const formCount = await FormModel.count({
      where: { templateId: id },
    })

    if (formCount > 0) {
      return res.status(400).json({ error: 'Cannot delete template. There are forms linked to this template.' })
    }

    const [updatedRows] = await TemplateModel.update(
      { isDeleted: true },
      { where: { id, isDeleted: false } },
    )

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Template not found or already deleted.' })
    }

    return res.status(200).json({ message: 'Template marked as deleted successfully.' })
  } catch (error) {
    console.error('Error marking template as deleted:', error)
    res.status(500).json({ error: 'Internal server error' })
    return next(error)
  }
})

templateRouter.get('/:id/can-delete', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    const formCount = await FormModel.count({
      where: { templateId: id },
    })

    console.log('formCount', formCount)

    // If formCount is 0, the template can be deleted
    const canDelete = formCount === 0

    return res.json({ canDelete })
  } catch (error) {
    console.error('Error checking if template can be deleted:', error)
    res.status(500).json({ error: 'Internal server error' })
    return next(error)
  }
})

export default templateRouter
