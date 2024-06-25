require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const host = process.env.HOST;
const clientSecret = process.env.CLIENT_KEY;
// Replace 'path_to_your_file' with the actual file path
const accessToken = fs.readFileSync('access_token.txt', 'utf8');


const body = {
    token: fs.readFileSync('token.txt', 'utf8'),
  };
const requestBody = JSON.stringify(body); // Minify the request body
const endpointUrl = '/snap/v1.0/registration-card-unbind';
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
    console.error(error.response.data)
  });