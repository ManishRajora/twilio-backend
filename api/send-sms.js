const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { numbers, message } = req.body;

  if (!numbers || !Array.isArray(numbers) || !message) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const results = [];
    for (const number of numbers) {
      const msg = await client.messages.create({
        body: message,
        from: twilioNumber,
        to: number,
      });
      results.push({ to: number, sid: msg.sid });
    }
    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};