const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000 || process.env.PORT; // Change this to your desired port

// Configuration OpenAI  API
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({ apiKey: process.env.ApiKey});
const openai = new OpenAIApi(configuration);

app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
});

// Apply rate limiting middleware to the API routes
app.use('/process', limiter);

// Endpoint to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); });

// Endpoint to process voice input with GPT-3
app.post('/process', async (req, res) => {
  const { voiceInput } = req.body;

  console.log(voiceInput + "1");

  try {
    // Implement GPT-3 API call to process the text
    // The "voiceInput" variable contains the user's spoken query in text form


    // Sending POST request with prompt
  const gptResponse= await openai.createCompletion({
    model:'text-davinci-002',
    prompt: voiceInput,
    temperature: 0.5,
    max_tokens: 150
  })

const gptTextResponse = gptResponse.data.choices[0].text;

    console.log(gptTextResponse);

    res.json({ response: gptTextResponse });
} catch (error) {
    console.error('Error processing voice input:', error);
    res.status(500).json({ error: 'An error occurred while processing the input.' });
}
});

app.listen(port, () => {
console.log(Server listening on port ${port});
});