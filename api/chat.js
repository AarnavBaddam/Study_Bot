export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Grab the messages from the frontend request
    const { messages } = req.body;

    // Send the request to Groq securely using the hidden environment variable
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}` // HIDDEN KEY!
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // Send Groq's response back to your frontend
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ error: { message: 'Internal Server Error', details: error.message } });
  }
}
