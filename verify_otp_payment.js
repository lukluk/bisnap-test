require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const host = process.env.HOST;
const clientSecret = process.env.CLIENT_KEY;
const accessToken = fs.readFileSync('access_token.txt', 'utf8');

const otp = fs.readFileSync('otp.txt', 'utf8');
const body = {
   "originalReferenceNo": "2020102977770000000009",
    otp: otp.split('::')[1],
    chargeToken: otp,
    type: "payment",
    additionalInfo: {
      bankCardToken: "5qofOnFhQmIUwZLBPA2HEjbXS9YgxEgjNiHh5hzVYlulaQXnHXcqlXMpBbLLxZOIlIY0LFBzifidu8fWiDm6p9h1xbjTEAsd6HTvYJVsW1Ne7Kt5D24p0o1mNVasG1qf"
    }
  };
const requestBody = JSON.stringify(body); // Minify the request body
const endpointUrl = '/snap/v1.0/otp-verification';
const httpMethod = 'POST';
const timestamp = new Date().toISOString();
const sha256Body = crypto.createHash('sha256').update(requestBody).digest('hex').toLowerCase();
const stringToSign = `${httpMethod}:${endpointUrl}:${accessToken}:${sha256Body}:${timestamp}`;
const signature = crypto.createHmac('sha512', clientSecret).update(stringToSign).digest('base64');

const headers = {
  'Authorization': "Bearer " + accessToken,
  'X-TIMESTAMP': timestamp,
  'X-SIGNATURE': signature,
  'X-PARTNER-ID': '2323',
  'CHANNEL-ID': '23232',
  'X-EXTERNAL-ID': '2323232',
  'Content-Type': 'application/json'
};


axios.post(`http://${host}${endpointUrl}`, body, { headers })
  .then(response => {    
    console.log(response.data)
  })
  .catch(error => {
    console.log("Error")
    console.error(error.response.data)});