require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const moment = require('moment');

async function generateAccessToken() {
  const host = process.env.HOST;
  const clientKey = process.env.CLIENT_KEY;
  const privateKey = fs.readFileSync('private_key.pem', 'utf8');

  const url = `https://${host}/snap/v1.0/access-token/b2b`;
  const xTimestamp = moment().toISOString();
  const stringToSign = `${clientKey}|${xTimestamp}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(stringToSign);
  const xSignature = signer.sign(privateKey, 'base64');

  try {
    const response = await axios.post(url, {
      grantType: 'client_credentials',
    }, {
      headers: {
        'X-SIGNATURE': xSignature,
        'X-CLIENT-KEY': clientKey,
        'X-TIMESTAMP': xTimestamp,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.accessToken) {      
      fs.writeFileSync('access_token.txt', response.data.accessToken);
      console.log('success', response.data);
    }
  } catch (error) {
    console.error('Error fetching access token:', error.response.data);
  }
}

generateAccessToken();