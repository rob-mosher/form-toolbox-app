import express, { NextFunction, Request, Response } from 'express'
import { FormModel, TemplateModel } from '../models'

const templateRouter = express.Router()

// For efficiency, only include the id and name when providing all template.
templateRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = await TemplateModel.findAll({
      where: { isDeleted: false },
      attributes: ['id', 'name'],
    })
    return res.json(templates)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
    return next(error) // TODO: see how this is handled in the other routes
  }
})

templateRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    const template = await TemplateModel.findAll({
      attributes: ['id', 'name', 'schema'],
      where: {
        id,
      },
    })
    return res.json(template)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
    return next(error) // TODO see how this is handled in the other routes
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
