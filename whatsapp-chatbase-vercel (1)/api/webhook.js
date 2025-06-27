import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).end();
  const data = req.body;
  const msg = data.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg?.text) return res.status(200).end();
  const from = msg.from;
  const text = msg.text.body.trim();

  try {
    // Chatbase API call
    const cb = await axios.post(
      'https://chatbase.com/api/chat',
      {
        api_key: process.env.CHATBASE_KEY,
        user_id: from,
        message: text
      }
    );
    const reply = cb.data.reply || 'Désolé, je n’ai pas compris.';

    // WhatsApp Business API call
    await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.META_PHONEID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: from,
        text: { body: reply }
      },
      { headers: { Authorization: `Bearer ${process.env.META_TOKEN}` } }
    );

    res.status(200).json({ status: 'success' });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
