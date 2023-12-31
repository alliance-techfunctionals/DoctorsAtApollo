import express from "express";
const router = express.Router();
import { logger } from "../utils/utils";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const docktorDetails = await prisma.doctors.findMany({
      where: { IsActive: true },
    });
    logger(false, `Getting Doctor Details : `, docktorDetails);
    res.send({ status: true, data: docktorDetails });
  } catch (err) {
    logger(true, `Getting Doctor Details failed due to.`, err);
    res.send({ status: false, message: `Getting Doctor Details failed due to.` ,  data: err });
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  try {
    const docktorDetail = await prisma.doctors.findFirst({
      where: { Id: doctor_id, IsActive: true },
    });
    logger(false, `Getting Doctor detail by Id ${doctor_id} : `, docktorDetail);
    res.send({ status: true, data: docktorDetail });
  } catch (err) {
    logger(true, `Getting Doctor Detail by Id ${doctor_id} failed due to.`, err);
    res.send({ status: false, message: `Getting Doctor Detail by Id ${doctor_id} failed due to.` ,  data: err });
  }
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  try {
    const updated_doctor_details = await prisma.doctors.update({
      where: { Id: doctor_id },
      data: { ...req.body , LastModifiedOn: new Date },
    });
    logger(false, `Updating Doctor detail by Id ${doctor_id} : `, updated_doctor_details);
    res.send({ status: true, data: updated_doctor_details });
  } catch (err) {
    logger(true, `Updating Doctor detail by Id ${doctor_id} failed due to.`, err);
    res.send({ status: false, message: `Updating Doctor detail by Id ${doctor_id} failed due to.` ,  data: err });
  }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  try {
    const deleted_doctor = await prisma.doctors.update({
      where: { Id: doctor_id },
      data: { IsActive: false },
    });
    logger(false, `Deleting Doctor Activity by Id ${doctor_id} : `, deleted_doctor);
    res.send({ status: true, data: deleted_doctor });
  } catch (err) {
    logger(true, `Deleting Doctor detail by Id ${doctor_id} failed due to.`, err);
    res.send({ status: false, message: `Deleting Doctor detail by Id ${doctor_id} failed due to.` ,  data: err });
  }
});

export default router;