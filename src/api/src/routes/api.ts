import express, { Request, Response } from 'express'
import formRouter from './forms'
import templateRouter from './templates'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.sendStatus(200)
})

router.use('/forms', formRouter)
router.use('/templates', templateRouter)

export default router
