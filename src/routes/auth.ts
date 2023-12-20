import { logger } from "../utils/utils";
import { randomNumber } from "../utils/utils";
import { sendOTP } from "../utils/utils";
import express from 'express';
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();

router.post("/sendOTP" , async (req: express.Request, res: express.Response) => {
    let OTP = randomNumber();
    logger(false, `Sending OTP ${OTP} to mobile : ${req.body.mobile}`);
    try {
        const callapi = await sendOTP(parseInt(OTP), req.body.mobile); 
        res.json({ success: true, message: `OTP sent successfully to Mobile ${req.body.mobile}` });
    } catch(err) {
        res.json({ success: false, message: `OTP sent Failed to Mobile ${req.body.mobile} , Try again later... ${err}` });
    }
});

export default router;