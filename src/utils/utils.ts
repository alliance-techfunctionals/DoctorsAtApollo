import path from "path";
import winston from "winston";
import fs from 'fs';
const axios = require('axios');
const qs = require('qs');
import buffer from "buffer";
import dotenv from 'dotenv';
dotenv.config();

// This function is used to generate random numbers for OTP.
function randomNumber() {
  let number = Math.floor(1000 + Math.random() * 9000).toString(10);
  return number;
}

function logger(err: Boolean, msg: String, res?: any) {
    const logFilePath = path.resolve(__dirname, "./logs.log");

    const logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.prettyPrint()
      ),
      defaultMeta: { error: err, message: msg, result: res },
      transports: [new winston.transports.File({ filename: logFilePath }), new winston.transports.Console()],
    });

    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, "");
    }
    if (err == true) {
      return logger.error(msg);
    } else {
      return logger.info(msg);
    }
  }

async function sendOTP(otp: number, mobile: number)   {
let data = qs.stringify({ 'variables_values': otp, 'route': 'otp', 'numbers': mobile });

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://www.fast2sms.com/dev/bulkV2',
  headers: { 
    'authorization': process.env.fast2SmsAuthKey, 
    'Content-Type': 'application/x-www-form-urlencoded', 
  },
  data : data};
  const result = await axios.request(config);
  return result;
}

function decodeJWTToken(jwt: any) {
  let parseToken = JSON.parse(buffer.Buffer.from(jwt.split(".")[1], "base64").toString("utf-8"));
  return parseToken;
}


  export {logger, randomNumber,sendOTP, decodeJWTToken};