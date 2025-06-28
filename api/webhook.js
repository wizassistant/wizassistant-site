export default async function handler(req, res) {
  const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;

  if (!message) {
    console.log('❌ Aucun message trouvé dans la requête.');
    return res.status(400).json({ success: false, error: 'No message received' });
  }

  console.log('📩 Message reçu sur WhatsApp :', message);

  // 🔗 Envoi du message à Chatbase
  try {
    const chatbaseRes = await fetch('https://www.chatbase.co/api/v1/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 1cac0499-66bd-40f7-9f3c-ddf39e2bb250' // ← Ta vraie clé API ici
      },
      body: JSON.stringify({
        agentId: 'G27xBX0vckUkWAr_tdr-M',
        message: message,
        chatId: req.body.entry[0].id || 'whatsapp-user'
      })
    });

    const data = await chatbaseRes.json();
    console.log('✅ Réponse de Chatbase :', data);

    res.status(200).json({ success: true, chatbase: data });
  } catch (error) {
    console.error('❌ Erreur lors de l’appel à Chatbase :', error);
    res.status(500).json({ success: false, error: 'Failed to call Chatbase' });
  }
}