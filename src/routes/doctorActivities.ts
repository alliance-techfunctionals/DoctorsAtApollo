import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { logger } from "../utils/utils";

router.get("/", async (req: express.Request, res: express.Response) => {
  const doctorActivities = await prisma.doctorActivities.findMany({
    where: { IsDeleted: false },
  });
  logger(false, `Getting Doctor Activities : `, doctorActivities);
  res.send({ status: true, data: doctorActivities });
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  const doctorActivity = await prisma.doctorActivities.findFirst({
    where: { Id: doctor_id, IsDeleted: false },
  });
  logger(false, `Getting Doctor Activity by Id ${doctor_id} : `, doctorActivity);
  res.send({ status: true, data: doctorActivity });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  const result = await prisma.doctorActivities.create({
    data: { ...req.body },
  });
  logger(false, `Creaing Doctor Activity : `, result);
  res.send({ status: true, data: result });
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  const updated_doctor_activities = await prisma.doctorActivities.update({
    where: { Id: doctor_id },
    data: { ...req.body },
  });
  logger(false, `Updating Doctor Activity by Id ${doctor_id} : `, updated_doctor_activities);
  res.send({ status: true, data: updated_doctor_activities });
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  const delete_docktor_activities = await prisma.doctorActivities.update({
    where: { Id: doctor_id },
    data: { IsDeleted: true },
  });
  logger(false, `Deleting Doctor Activity by Id ${doctor_id} : `, delete_docktor_activities);
  res.send({ status: true, data: delete_docktor_activities });
});

export default router;