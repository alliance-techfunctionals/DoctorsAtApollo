import { logger } from "../utils/utils";
import { randomNumber } from "../utils/utils";
import express from 'express';
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.get("/sendOTP" , async (req: express.Request, res: express.Response) => {
    
});

export default router;