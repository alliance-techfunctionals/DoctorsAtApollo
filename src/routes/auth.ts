import { logger } from "../utils/utils";
import { randomNumber } from "../utils/utils";
import { sendOTP } from "../utils/utils";
import express from 'express';
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

router.post("/sendOTP" , async (req: express.Request, res: express.Response) => {
    let OTP = randomNumber();
    if (!req.body.mobile)  {
        res.json({ success: false, message: `Mobile is must, But got ${req.body.mobile} .`});
    }
    try {
        const callapi = await sendOTP(parseInt(OTP), req.body.mobile); 
        logger(false, `Sending OTP ${OTP} to mobile : ${req.body.mobile} , Status : ${callapi.status}`, OTP);
        res.json({ success: true, message: `OTP sent successfully to Mobile ${req.body.mobile}`, data: { OTP: parseInt(OTP) }   });
    } catch(err) {
        res.json({ success: false, message: `OTP sent Failed to Mobile ${req.body.mobile} , Try again later... ${err}` });
    }
});

router.post("/register", async (req: express.Request, res: express.Response) => {
    const tokenSecret : any = process.env.TOKEN_SECRET;
    let result;
    try {
      result = await prisma.doctors.create({
        data: { ...req.body },
      });
      // Creating JSON Web Token
      const token = jwt.sign(result, tokenSecret, { expiresIn: "120d" });
      logger(false, `Creating Doctor details : `, result);
      res.send({ status: true, data: {doctor: result, token: token } });
    } catch (err)  {
      logger(true, `Creating Doctor detail failed due to.`, err);
      res.send({ status: false, message: `Creating Doctor detail failed due to.` ,  data: err });
    }
});

router.get("/login" , async (req: express.Request, res: express.Response) => {
    const tokenSecret : any = process.env.TOKEN_SECRET;
    if (!req.body.mobile)  {
      return res.send({ status : false, message: "Mobile is mustt get doctor details." });
    }
    let result, token;
    try {
      result = await prisma.doctors.findFirst({
        where: { MobileNumber: req.body.mobile }});
      if (result)  {
       // Creating JSON Web Token
       token = jwt.sign(result, tokenSecret, { expiresIn: "120d" });
       logger(false, `Getting Doctor details By Mobile : `, result);
       res.send({ status: true, data: { doctor: result, token: token } });
      } else {
        res.send({status: false, message: `Doctor not registered. Please register doctor first.`});
      }
      
    } catch (err) {
      res.send({status: false, message: "Get Doctor details operation failed due to" , data: err});
    }
});
  
// router.post("/verifyOTP", async (req: express.Request, res: express.Response) => {
//     const OTP = parseInt(req.body.otp); 
//     const doctor = await prisma.doctorDetails.findFirst({ where: { MobileNumber: req.body.mobile }})
//     if (doctor?.Otp != OTP) {
//         logger(true, `Incorrect OTP ${doctor?.Otp}`);
//         res.json({ success: false, message: `Incorrect OTP..` });
//     } else {
//         // Update Mobile Number to doctor Schema
//          const updatedDoctor = await prisma.doctorDetails.update({ 
//             where: { MobileNumber: req.body.mobile }, 
//             data: { Otp: null , IsOTPVerified: true }
//          });
//         logger(false, `OTP verification success.`);
//         res.json({ success: true, message: `OTP verification success.`});
//     }
// });



export default router;