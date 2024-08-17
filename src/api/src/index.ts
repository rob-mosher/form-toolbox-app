import cors from 'cors'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import listEndpoints from 'express-list-endpoints'
import { sequelize } from './models'
import apiRouter from './routes/api'
import seedTemplates from './seeders/initTemplates'
import { startPolling } from './services/aws/sqs/poller'

dotenv.config({ path: '../../.env' })

const API_HOST = process.env.API_HOST || 'localhost'
const API_PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 3000

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.sendStatus(200)
})

app.get('/healthcheck', (req: Request, res: Response) => {
  res.sendStatus(200)
})

app.use('/api', apiRouter)

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  const errorObj = {
    log: `No matching path for incoming request to '${req.originalUrl}'`,
    status: 404,
    message: { err: 'Error 404: Page not Found' },
  }
  next(errorObj)
})

// Disable eslint rule for Express's global error handler (requires exactly 4 params)
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  }

  const errorObj = Object.assign(defaultErr, err)
  console.error(errorObj.log)

  res.status(errorObj.status).json(errorObj.message)
})

if (process.env.NODE_ENV !== 'test') {
  console.log('Syncronizing database schema:')
  sequelize.sync()
    .then(() => {
      console.log('Successfully syncronized database schema.')
      return seedTemplates() // Must complete before remaining logic can occur (see below)
    })
    .then(() => { // Allows seedTemplates() to complete before proceeding (see above)
      app.listen(API_PORT, API_HOST, () => {
        console.log(`Server listening on ${API_HOST}:${API_PORT}`)
        startPolling()
      })
      console.log('API endpoints are:')
      console.log(listEndpoints(app))
    })
    .catch(() => {
      console.error('Error syncronizing database schema. API will not load as a result.')
    })
}

export default app
