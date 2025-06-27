# WhatsApp ←→ Chatbase Integration

This project sets up a webhook on Vercel to forward WhatsApp messages to Chatbase and send responses back.

## Setup

1. Rename `.env.example` to `.env.local`.
2. Fill in your environment variables:
   - CHATBASE_API_KEY
   - WHATSAPP_TOKEN
   - WHATSAPP_PHONE_NUMBER_ID
3. Deploy on Vercel:
   ```
   vercel
   ```
4. Configure your WhatsApp webhook:
   ```
   https://<your-vercel-project>.vercel.app/api/webhook
   ```

## Development

Run locally with:
```
npm install
vercel dev
```
