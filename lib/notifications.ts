export async function sendWhatsAppMessage(phone: string, message: string) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  if (!token || !phoneId) return;

  const url = `https://graph.facebook.com/v15.0/${phoneId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to: phone.replace(/\D/g, ''),
    type: 'text',
    text: { body: message },
  };

  await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
