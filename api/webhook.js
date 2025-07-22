export default async function handler(req, res) {
  // 1) Vérification du webhook (GET)
  if (req.method === 'GET') {
    const mode      = req.query['hub.mode'];
    const token     = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // ← Debug : affiche ce qui arrive et ce qui est attendu
    console.log('📥 Webhook GET', {
      mode,
      incomingToken: token,
      expectedToken: process.env.WHATSAPP_VERIFY_TOKEN,
      challenge
    });

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Erreur de vérification du token');
    }
  }

  // 2) Réception des notifications (POST)
  if (req.method === 'POST') {
    const body = req.body;

    // Vérifie qu'il s'agit bien d'une notification WhatsApp Business
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        const change   = entry.changes?.[0];
        const value    = change?.value;
        const messages = value?.messages;

        if (!messages) continue;

        for (const message of messages) {
          const from = message.from;            // numéro de l’expéditeur
          const text = message.text?.body;      // contenu du message

          if (!text) continue; // ignore si pas de texte

          // 2.a) Envoi du message à Chatbase
          const chatbaseRes = await fetch('https://api.chatbase.com/v1/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.CHATBASE_API_KEY}`,
            },
            body: JSON.stringify({
              message:    text,
              session_id: from,
            }),
          });
          const chatbaseData = await chatbaseRes.json();
          const reply = chatbaseData.response; // adapte si la propriété change

          // 2.b) Envoi de la réponse via l’API Graph WhatsApp
          await fetch(
            `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to:                from,
                text: { body: reply },
              }),
            }
          );
        }
      }

      // Facebook attend un 200 pour considérer que c’est OK
      return res.status(200).send('EVENT_RECEIVED');
    }

    // Si ce n'est pas notre type d’événement
    return res.sendStatus(404);
  }

  // 3) Méthode non-supportée
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} not allowed`);
}