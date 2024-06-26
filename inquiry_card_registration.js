require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');
const host = process.env.HOST;
const endpointUrl = '/snap/v1.0/registration-card-inquiry';

async function  inquiryCard() {  
  const accessToken = fs.readFileSync('access_token.txt', 'utf8');
  const timestamp = new Date().toISOString();
  
  try {
    const response = await axios.get(`https://${host}${endpointUrl}/custIdMerchant/0012345679504`, {
      headers: {
        'Authorization': "Bearer "+accessToken,
        'X-TIMESTAMP': timestamp,        
        'X-PARTNER-ID': '123',
        'CHANNEL-ID': '123',
        'X-EXTERNAL-ID': '2323232',
        'Content-Type': 'application/json'
      }
    });

    console.log('inquiry card Response:', JSON.stringify(response.data));
  } catch (error) {
    console.error('Error making inquiry card:', error);
  }

}

inquiryCard();