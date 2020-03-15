const cors = require('cors');
const express = require('express');
const expressSession = require('express-session');
const knexSession = require('connect-session-knex')(expressSession);
const knex = require('./lib/db/config.js');

// Import routes
const users = require('./routes/users');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Persisting unique sessions
app.set('trust proxy', 1);
app.use(expressSession({
  secret: 'bamboozleSecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 24 * 365 * 1000,
    secure: false,
  },
  store: new knexSession({
    knex,
    clearInterval: 900000,
  }),
}));

// Use the imported routes
app.use('/users', users);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✓   Server started! Listening on port: ${port}\n`);
});
