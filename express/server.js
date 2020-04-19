'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const { addNest, eventsHandler, getStatus } = require('./sse');
const cors = require('cors');

const app = express();

// These was here
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
})

app.post('/nest', addNest);
app.get('/events', eventsHandler);
app.get('/status', getStatus);


module.exports = app;
module.exports.handler = serverless(app);
