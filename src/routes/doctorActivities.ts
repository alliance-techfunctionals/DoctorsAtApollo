import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { logger } from "../utils/utils";

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const doctorActivities = await prisma.doctorActivities.findMany({
      where: { IsDeleted: false },
    });
    logger(false, `Getting Doctor Activities : `, doctorActivities);
    res.send({ status: true, message: `Getting Doctor Activities : ` , data: doctorActivities });
  } catch (err) {
    logger(true, `Getting Doctor Activities operation failed due to.`, err);
    res.send({ status: false, message: `Getting Doctor Activities operation failed due to.`, data: err });
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  try {
    const doctorActivity = await prisma.doctorActivities.findFirst({
      where: { Id: doctor_id, IsDeleted: false },
    });
    logger(false, `Getting Doctor Activity by Id ${doctor_id} : `, doctorActivity);
    res.send({ status: true, message: `Getting Doctor Activity by Id ${doctor_id} : `, data: doctorActivity });
  } catch (err)  {
    logger(true, `Getting Doctor Activities operation failed due to.`, err);
    res.send({ status: false, message: `Getting Doctor Activities operation failed due to.`, data: err });
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const result = await prisma.doctorActivities.create({
      data: { ...req.body },
    });
    logger(false, `Creaing Doctor Activity : `, result);
    res.send({ status: true, data: result });
  } catch (err) {
    logger(true, `Creaing Doctor Activity failed due to.`, err);
    res.send({ status: false, message: `Creaing Doctor Activity failed due to.`, data: err });
  }
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  try {
    const updated_doctor_activities = await prisma.doctorActivities.update({
      where: { Id: doctor_id },
      data: { ...req.body },
    });
    logger(false, `Updating Doctor Activity by Id ${doctor_id} : `, updated_doctor_activities);
    res.send({ status: true, data: updated_doctor_activities });
  } catch (err) {
    logger(true, `Updating Doctor Activity by Id ${doctor_id} failed due to.`, err);
    res.send({ status: false, message: `Updating Doctor Activity by Id ${doctor_id} failed due to.`, data: err });
  }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const doctor_id = parseInt(req.params.id);
  try {
    const delete_docktor_activities = await prisma.doctorActivities.update({
      where: { Id: doctor_id },
      data: { IsDeleted: true },
    });
    logger(false, `Deleting Doctor Activity by Id ${doctor_id} : `, delete_docktor_activities);
    res.send({ status: true, data: delete_docktor_activities });
  } catch (err) {
    logger(true, `Deleting Doctor Activity by Id ${doctor_id} failed due to.`, err);
    res.send({ status: false, message: `Deleting Doctor Activity by Id ${doctor_id} failed due to.`, data: err });
  }
});

export default router;