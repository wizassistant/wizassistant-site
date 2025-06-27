# WhatsApp Business & Chatbase Integration (Vercel)

This project sets up a serverless function on Vercel to connect Chatbase AI to WhatsApp Business API.

## Setup

1. Clone this repo and navigate into it:
   ```bash
   git clone <repo-url>
   cd whatsapp-chatbase-vercel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Rename `.env.example` to `.env.local`
   - Fill in your credentials:
     ```
     META_TOKEN=your_meta_access_token
     META_PHONEID=your_meta_phone_number_id
     CHATBASE_KEY=your_chatbase_api_key
     ```

4. Run locally:
   ```bash
   npm run dev
   ```

5. Deploy on Vercel:
   Push to GitHub and import the repository in your Vercel dashboard.

## How it works

- Incoming WhatsApp messages hit `/api/webhook` via the WhatsApp Business API webhook.
- The function forwards the message to Chatbase and sends the AI's reply back through WhatsApp.
