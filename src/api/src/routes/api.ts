import express, { Request, Response } from 'express'

import formRouter from './forms'
import formTypesRouter from './formTypes'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.sendStatus(200)
})

router.use('/forms', formRouter)
router.use('/formtypes', formTypesRouter)

export default router
