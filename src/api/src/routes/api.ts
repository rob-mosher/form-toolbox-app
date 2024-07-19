import express, { Request, Response } from 'express'
import formTypesRouter from './formTypes'
import formRouter from './forms'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.sendStatus(200)
})

router.use('/forms', formRouter)
router.use('/formtypes', formTypesRouter)

export default router
