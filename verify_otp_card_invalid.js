require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const host = process.env.HOST;
const clientSecret = process.env.CLIENT_ID;
const accessToken = fs.readFileSync('access_token.txt', 'utf8');

const otp = fs.readFileSync('otp.txt', 'utf8');
const body = {
    otp: otp.split('::')[1],
    chargeToken: otp,
    type: "card"
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
  'X-IP-ADDRESS': '',
  'X-DEVICE-ID' : 'deviceid',
  'X-LATITUDE' : '22',
  'X-LONGITUDE' : '22',
  'ORIGIN' : 'web',
  'X-EXTERNAL-ID': Math.random().toString(36).substring(7),
  'Content-Type': 'application/json'
};


axios.post(`${host}${endpointUrl}`, body, { headers })
  .then(response => {    
    fs.writeFileSync('token.txt', response.data.bankCardToken);
    console.log(response.data)
  })
  .catch(error => {
    console.log("Error")
    console.error(error.response.data)
    
  });