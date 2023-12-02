import express, { NextFunction, Request, Response } from 'express'

import { FormType } from '../models'

const formTypesRouter = express.Router()

// For efficiency, only include the id and name when providing all formTypes.
formTypesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formTypes = await FormType.findAll({
      attributes: ['id', 'name'],
    })
    return res.json(formTypes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
    return next(error) // TODO see how this is handled in the other routes
  }
})

formTypesRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    const formType = await FormType.findAll({
      attributes: ['id', 'name', 'schema'],
      where: {
        id,
      },
    })
    return res.json(formType)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
    return next(error) // TODO see how this is handled in the other routes
  }
})

export default formTypesRouter
