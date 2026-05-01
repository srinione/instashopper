const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check — visit /api/health to confirm server + API key are working
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    keyPreview: hasKey ? process.env.ANTHROPIC_API_KEY.slice(0, 8) + '...' : 'MISSING'
  });
});

// Gift generation
app.post('/api/gifts', async (req, res) => {
  const { recipient, interests, occasion, budget } = req.body;

  if (!recipient || !interests) {
    return res.status(400).json({ error: 'Recipient and interests are required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const prompt = `You are a thoughtful gift expert. Generate exactly 5 unique gift ideas for:
- Recipient: ${recipient}
- Interests: ${interests}
- Occasion: ${occasion || 'general gift'}
- Budget: ${budget || '$25-$50'}

Respond ONLY with a valid JSON array. No markdown, no backticks, nothing else:
[{"name":"...","price":"$XX","why":"One sentence why perfect for them.","searchQuery":"Amazon search query"}]`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    console.log('Anthropic status:', response.status);

    if (!response.ok) {
      console.error('Anthropic error:', JSON.stringify(data));
      return res.status(500).json({ error: data.error?.message || 'Anthropic API error' });
    }

    const text = data.content?.map(b => b.text || '').join('') || '';
    console.log('Raw response:', text.slice(0, 200));

    const clean = text.replace(/```json|```/g, '').trim();
    const gifts = JSON.parse(clean);
    res.json({ gifts });

  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`InstaShoper running on port ${PORT}`);
  console.log(`API key present: ${!!process.env.ANTHROPIC_API_KEY}`);
});
