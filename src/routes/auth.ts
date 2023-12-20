import { logger } from "../utils/utils";
import { randomNumber } from "../utils/utils";
import { sendOTP } from "../utils/utils";
import express from 'express';
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

router.post("/sendOTP" , async (req: express.Request, res: express.Response) => {
    let OTP = randomNumber();
    try {
        const callapi = await sendOTP(parseInt(OTP), req.body.mobile); 
        logger(false, `Sending OTP ${OTP} to mobile : ${req.body.mobile} , Status : ${callapi.status}`);
        // Update Mobile Number to doctor Schema
        const x : any = { 
            where: { MobileNumber: req.body.mobile }, 
            data: { Otp: parseInt(OTP) }
        }
        const updatedDoctor = await prisma.doctorDetails.update(x);
        res.json({ success: true, message: `OTP sent successfully to Mobile ${req.body.mobile}` });
    } catch(err) {
        res.json({ success: false, message: `OTP sent Failed to Mobile ${req.body.mobile} , Try again later... ${err}` });
    }
});

router.post("/verifyOTP", async (req: express.Request, res: express.Response) => {
    const tokenSecret : any = process.env.TOKEN_SECRET;
    const OTP = parseInt(req.body.otp); 
    const doctor = await prisma.doctorDetails.findFirst({ where: { MobileNumber: req.body.mobile }})
    if (doctor?.Otp != OTP) {
        logger(true, `Incorrect OTP ${doctor?.Otp}`);
        res.json({ success: false, message: `Incorrect OTP..` });
    } else {
        // Update Mobile Number to doctor Schema
         const updatedDoctor = await prisma.doctorDetails.update({ 
            where: { MobileNumber: req.body.mobile }, 
            data: { Otp: null , IsOTPVerified: true }
         });
        logger(false, `OTP verification success.`);

        // Creating JSON Web Token
        const token = jwt.sign(
        { Id: updatedDoctor.Id, DoctorName: updatedDoctor.DoctorName, MobileNumber: updatedDoctor.MobileNumber, DepartmentId: updatedDoctor.DepartmentId }, 
        tokenSecret, { expiresIn: "120d" });
        res.json({ success: true, message: `OTP verification success.`, data: token });
    }
});



export default router;