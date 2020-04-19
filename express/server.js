'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const { addNest, eventsHandler, getStatus } = require('./sse');
const cors = require('cors');

const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>SSE Testing!</h1>');
  res.end();
});
router.post('/', (req, res) => res.json({ postBody: req.body }));
router.post('/nest', addNest);
router.get('/events', eventsHandler);
router.get('/status', getStatus);
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));

app.use(cors());
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
