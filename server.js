const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Gift generation endpoint
app.post('/api/gifts', async (req, res) => {
  const { recipient, interests, occasion, budget } = req.body;

  if (!recipient || !interests) {
    return res.status(400).json({ error: 'Recipient and interests are required' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `You are a thoughtful gift expert. Generate exactly 5 unique, creative gift ideas for:
- Recipient: ${recipient}
- Interests/Personality: ${interests}
- Occasion: ${occasion || 'general gift'}
- Budget: ${budget || '$25-$50'}

Respond ONLY with a valid JSON array, no markdown, no backticks, no extra text:
[{"name":"...","price":"$XX","why":"One sentence why it is perfect for them.","searchQuery":"exact Amazon search query"}]`
      }]
    });

    const text = message.content.map(b => b.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const gifts = JSON.parse(clean);
    res.json({ gifts });
  } catch (err) {
    console.error('Anthropic error:', err.message);
    res.status(500).json({ error: 'Failed to generate gifts. Please try again.' });
  }
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`InstaShoper running on port ${PORT}`);
});
