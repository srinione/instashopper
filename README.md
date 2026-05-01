# InstaShoper 🎁

AI-powered gift finder.

## Project Structure

```
instashopper-final/
├── Dockerfile
├── railway.toml
├── package.json
├── server.js          ← Node.js backend (API calls live here)
├── public/
│   └── index.html     ← Frontend
└── README.md
```

## Deploy to Railway

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/instashopper.git
git push -u origin main
```

### 2. Deploy on Railway
1. Go to railway.app → New Project → Deploy from GitHub repo
2. Select your `instashopper` repository
3. Railway auto-detects the Dockerfile and deploys

### 3. ⚠️ Add your Anthropic API Key (IMPORTANT)
Without this, the gift finder won't work.

1. In Railway, open your project
2. Click your service → **Variables** tab
3. Click **New Variable**
4. Set:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your API key from console.anthropic.com
5. Click **Add** → Railway redeploys automatically

### 4. Get your Anthropic API Key
1. Go to console.anthropic.com
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy and paste into Railway Variables

### 5. Add Custom Domain (optional)
Settings → Networking → Custom Domain → add your domain → set CNAME in GoDaddy

## Local Development
```bash
# Create .env file
echo "ANTHROPIC_API_KEY=your_key_here" > .env

# Install and run
npm install
node server.js

# Open http://localhost:3000
```
