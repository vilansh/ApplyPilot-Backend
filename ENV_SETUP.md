# Environment Variables Setup Guide

Create a `.env` file in your project root with the following variables:

## Required Variables

```env
# Weaviate Configuration
WEAVIATE_URL=https://your-weaviate-instance.weaviate.network
WEAVIATE_API_KEY=your-weaviate-api-key

# HuggingFace Configuration
HF_TOKEN=your-huggingface-token

# Session Configuration
SESSION_SECRET=your-session-secret-key

# Google OAuth Configuration (for Gmail)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GMAIL_REDIRECT_URI=http://localhost:5000/auth/callback
```

## How to Get These Credentials

### 1. Weaviate
- Sign up at [Weaviate Cloud Console](https://console.weaviate.cloud/)
- Create a new cluster
- Get your API key and URL

### 2. HuggingFace
- Go to [HuggingFace Settings](https://huggingface.co/settings/tokens)
- Create a new token with "read" permissions

### 3. Google OAuth (for Gmail)
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing
- Enable Gmail API
- Create OAuth 2.0 credentials
- Set redirect URI to `http://localhost:5000/auth/callback`

### 4. Session Secret
- Generate a random string (any secure random string)

## Testing the Setup

1. Start the server: `npm start`
2. Test the endpoint: `http://localhost:5000/test`
3. Authenticate Gmail: `http://localhost:5000/auth/google`
4. Send test email via your frontend

## Troubleshooting

- **401 Gmail Error**: Make sure you've authenticated via `/auth/google`
- **HuggingFace Error**: Check your API key is correct
- **Weaviate Error**: Verify your cluster URL and API key 