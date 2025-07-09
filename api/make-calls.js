const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { numbers } = req.body;

  if (!numbers || !Array.isArray(numbers)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const results = [];
    for (const number of numbers) {
      // Place a call using Twilio Voice API and play a message
      const call = await client.calls.create({
        url: 'https://twi-ml-xml.vercel.app/',
        to: number,
        from: twilioNumber,
      });
      results.push({ to: number, sid: call.sid });
    }
    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};