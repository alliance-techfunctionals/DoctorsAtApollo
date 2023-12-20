import path from "path";
import winston from "winston";
import fs from 'fs';

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

  export {logger, randomNumber };