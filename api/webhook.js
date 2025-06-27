import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const { messages } = req.body;
  const chatbaseApiKey = process.env.CHATBASE_API_KEY;
  const whatsappToken = process.env.WHATSAPP_TOKEN;

  // Forward message to Chatbase
  const response = await fetch('https://chatbase.com/api/v1/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${chatbaseApiKey}`,
    },
    body: JSON.stringify({ query: messages[0].text.body }),
  });
  const data = await response.json();

  // Send response back to WhatsApp
  await fetch(`https://graph.facebook.com/v14.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${whatsappToken}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: messages[0].from,
      text: { body: data.reply },
    }),
  });

  res.status(200).json({ success: true });
}
