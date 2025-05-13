const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { lyrics } = JSON.parse(event.body);

    const prompt = `You are an expert lyrics analyst.
Given the following lyrics, determine if they are:
A) From a published, recognizable human-written song
B) Likely human-written but unpublished
C) Possibly AI-generated
D) Very likely AI-generated

Consider repeated title phrases, structure (verse/chorus), rhyme style, and tone. 
Respond in this JSON format:

{
  "verdict": "...",
  "confidence": ...,
  "explanation": "..."
}

Lyrics:
"""${lyrics}"""`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      messages: [
        { role: "system", content: "You are a lyrics analysis engine." },
        { role: "user", content: prompt }
      ],
    });

    const reply = response.data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: reply
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error analyzing lyrics", details: error.message }),
    };
  }
};