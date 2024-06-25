require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const host = process.env.HOST;
const clientSecret = process.env.CLIENT_KEY;
// Replace 'path_to_your_file' with the actual file path
const accessToken = fs.readFileSync('access_token.txt', 'utf8');
const md5Key = crypto.createHash('md5').update(clientSecret).digest("hex");

const cardData = {
  bankCardType: "D",
  bankCardNo: "5859700200000863",
  identificationNo: "3511000101806128",
  identificationType: "02",
  email: "crisevan@gmail.com",
  expiryDate: "1027"
};

function encryptCardData(data, key, iv) {
  console.log('Key:', key, iv);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

const encryptedCardData = encryptCardData(cardData, md5Key, clientSecret);

const body = {
    custIdMerchant: "0012345679504",
    cardData: encryptedCardData
  };
const requestBody = JSON.stringify(body); // Minify the request body
const endpointUrl = '/snap/v1.0/registration-card-bind';
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


axios.post(`http://${host}/snap/v1.0/registration-card-bind`, body, { headers })
  .then(response => {        
    fs.writeFileSync('otp.txt', response.data.chargeToken);
    console.log(response.data)
  })
  .catch(error => {console.log("Error"); console.error(error)});