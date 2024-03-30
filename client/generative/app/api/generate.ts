// Import necessary types from Next.js
import type { NextApiRequest, NextApiResponse } from 'next';

// Import OpenAI API client
import OpenAI from 'openai';

// Initialize OpenAI client with your API key from environment variables
const openai = new OpenAI(process.env.OPENAI_KEY);

// Define the handler function for the API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    // Extract the prompt from the request body
    const { prompt } = req.body;
    try {
      // Call the OpenAI API to generate text
      const response = await openai.Completions.create({
        engine: 'text-davinci-002',
        prompt,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 0.7,
      });
      // Respond with the generated text
      res.status(200).json({ generatedText: response.choices[0].text });
    } catch (error) {
      // Handle errors and respond with an error message
      res.status(500).json({ error: 'Failed to generate text' });
    }
  } else {
    // Respond with Method Not Allowed if the request method is not POST
    res.status(405).end(); // Method Not Allowed
  }
}
