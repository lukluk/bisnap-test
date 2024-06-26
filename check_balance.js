require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');
const host = process.env.HOST;
const clientSecret = process.env.CLIENT_KEY;
const httpMethod = 'POST';
const endpointUrl = '/snap/v1.0/balance-inquiry';
const requestBody = JSON.stringify({ accountNo: "1000015802" }); // Minify the request body

async function  checkBalance() {  
  const accessToken = fs.readFileSync('access_token.txt', 'utf8');
  const timestamp = new Date().toISOString();
  const sha256Body = crypto.createHash('sha256').update(requestBody).digest('hex').toLowerCase();
  const stringToSign = `${httpMethod}:${endpointUrl}:${accessToken}:${sha256Body}:${timestamp}`;
  console.log('String to sign:', stringToSign)
  console.log('Client Secret:', clientSecret)
  const xSignature = crypto.createHmac('sha512', clientSecret).update(stringToSign).digest('base64');

  try {
    const response = await axios.post(`http://${host}${endpointUrl}`, requestBody, {
      headers: {
        'Authorization': "Bearer "+accessToken,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': xSignature,
        'X-PARTNER-ID': '123',
        'CHANNEL-ID': '123',
        'X-EXTERNAL-ID': '2323232',
        'Content-Type': 'application/json'
      }
    });

    console.log('Balance Inquiry Response:', response.data);
  } catch (error) {
    console.error('Error making balance inquiry:', error.response.data);
  }

}

checkBalance();