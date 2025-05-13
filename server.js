const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();

// CORS configuration — allow only your frontend domain
app.use(cors({
  origin: 'https://ailyricschecker.com'
}));

app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/checkLyrics', async (req, res) => {
  const lyrics = req.body.lyrics;

  const prompt = `You are an expert lyrics analyst.
Given the following lyrics, determine if they are:
A) From a published, recognizable human-written song
B) Likely human-written but unpublished
C) Possibly AI-generated
D) Very likely AI-generated

Respond in this JSON format:
{
  "verdict": "...",
  "confidence": ...,
  "explanation": "..."
}

Lyrics:
"""${lyrics}"""`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      messages: [
        { role: "system", content: "You are a lyrics analysis engine." },
        { role: "user", content: prompt }
      ]
    });

    const reply = completion.data.choices[0].message.content.trim();
    res.setHeader('Content-Type', 'application/json');
    res.send(reply);
  } catch (err) {
    res.status(500).json({ error: 'Error analyzing lyrics', details: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Lyrics checker running on port ${PORT}`);
});
