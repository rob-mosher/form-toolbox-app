import express, { NextFunction, Request, Response } from 'express'
import { Template } from '../models'

const templateRouter = express.Router()

// For efficiency, only include the id and name when providing all template.
templateRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const template = await Template.findAll({
      attributes: ['id', 'name'],
    })
    return res.json(template)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
    return next(error) // TODO see how this is handled in the other routes
  }
})

templateRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    const template = await Template.findAll({
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

export default templateRouter
