import express from "express";
const router = express.Router();
import { logger } from "../utils/utils";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.get("/", async (req: express.Request, res: express.Response) => {
  const docktorDetails = await prisma.doctorDetails.findMany({
    where: { IsActive: true },
  });
  logger(false, `Getting Doctor Details : `, docktorDetails);
  res.send({ status: true, data: docktorDetails });
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  const docktorDetail = await prisma.doctorDetails.findFirst({
    where: { Id: doctor_id, IsActive: true },
  });
  logger(false, `Getting Doctor detail by Id ${doctor_id} : `, docktorDetail);
  res.send({ status: true, data: docktorDetail });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  let result;
  try {
    result = await prisma.doctorDetails.create({
      data: { ...req.body },
    });
    logger(false, `Creating Doctor details : `, result);
  } catch (err)  {
    logger(false, `Creating Doctor failed due to. : `, err);
  }
  res.send({ status: true, data: result });
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  const updated_doctor_details = await prisma.doctorDetails.update({
    where: { Id: doctor_id },
    data: { ...req.body , LastModifiedOn: new Date },
  });
  logger(false, `Updating Doctor detail by Id ${doctor_id} : `, updated_doctor_details);
  res.send({ status: true, data: updated_doctor_details });
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  const deleted_doctor = await prisma.doctorDetails.update({
    where: { Id: doctor_id },
    data: { IsActive: false },
  });
  logger(false, `Deleting Doctor Activity by Id ${doctor_id} : `, deleted_doctor);
  res.send({ status: true, data: deleted_doctor });
});

export default router;