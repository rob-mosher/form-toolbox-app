require('dotenv').config({ path: '../../.env' });

const cors = require('cors');

const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());

const { API_HOST } = process.env;
const { API_PORT } = process.env;

const apiRouter = require('./routes/api');
const seedFormTypes = require('./seeders/initFormTypes');
const sqsPoller = require('./services/aws/sqs/poller');
const { sequelize } = require('./models');

app.get('/', (req, res, next) => {
  res.sendStatus(200);
});

app.get('/healthcheck', (req, res, next) => {
  res.sendStatus(200);
});

app.use('/api', apiRouter);

app.use('*', (req, res, next) => {
  const errorObj = {
    log: `No matching path for incoming request to '${req.originalUrl}'`,
    status: 404,
    message: { err: 'Error 404: Page not Found' },
  };
  next(errorObj);
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  const errorObj = Object.assign(defaultErr, err);
  console.error(errorObj.log);

  res.status(errorObj.status).json(errorObj.message);
});

if (process.env.NODE_ENV !== 'test') {
  console.log('Syncronizing database schema:');
  sequelize.sync()
    .then(() => {
      console.log('Successfully syncronized database schema.');
      return seedFormTypes(); // Must complete before remaining logic can occur (see below)
    })
    .then(() => { // Allows seedFormTypes() to complete before proceeding (see above)
      app.listen(API_PORT, API_HOST, () => {
        console.log(`Server listening on ${API_HOST}:${API_PORT}`);
        sqsPoller.startPolling();
      });
    })
    .catch(() => {
      console.error('Error syncronizing database schema. API will not load as a result.');
    });
}

module.exports = app;
