require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router');
const membersRouter = require('./members/members-router');
const charactersRouter = require('./characters/characters-router');
const questsRouter = require('./quests/quests-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

// set up middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/members', membersRouter);
app.use('/api/characters', charactersRouter);
app.use('/api/quests', questsRouter);

// request handling
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});

// error handling
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'Server error' } };
  } else {
    response = { message: error.message, error };
  }

  res.status(500).json(response);
};

app.use(errorHandler);

// the bottom line, literally
module.exports = app;
