const express = require('express');
const bodyParser = require('body-parser');
const handler = require('./netlify/functions/checkLyrics.js');

const app = express();
app.use(bodyParser.json());

app.post('/checkLyrics', async (req, res) => {
  const event = { httpMethod: 'POST', body: JSON.stringify(req.body) };
  const context = {};
  const response = await handler.handler(event, context);
  res.status(response.statusCode).send(response.body);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Lyrics checker running on port ${PORT}`);
});
