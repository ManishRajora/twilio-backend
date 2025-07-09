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
        url: 'http://twimlets.com/message?Message%5B0%5D=This%20is%20an%20emergency%20call%20from%20AAS%20Safety%20App.%20Please%20check%20on%20your%20contact%20immediately.',
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