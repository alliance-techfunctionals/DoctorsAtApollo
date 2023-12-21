import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
import { logger  } from "../utils/utils";
const prisma = new PrismaClient();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const patientDetails = await prisma.patients.findMany({
      where: { IsActive: true },
    });
    const patientIds = patientDetails.map(item => item.Id);
    const doctorActivities = await prisma.doctorActvities.findMany({
      where: { IsDeleted: false },
    });
    logger(false, `Getting Patient Details : `, patientDetails);
    res.send({ status: true, data: patientDetails });
  } catch (err) {
    logger(true, `Getting Patient Details operation failed due to.`, err);
    res.send({ status: false, message: `Getting Patient Details operation failed due to.` , data: err });
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const patient_id = parseInt(req.params.id);
  try {
    const patientDetail = await prisma.patients.findFirst({
      where: { Id: patient_id, IsActive: true },
    });
    logger(false, `Getting Patient Detail by Id : ${patient_id} `, patientDetail);
    res.send({ status: true, data: patientDetail });
  } catch (err) {
    logger(true, `Getting Patient Detail by Id ${patient_id} operation failed due to.`, err);
    res.send({ status: false, message: `Getting Patient Detail by Id ${patient_id} operation failed due to.` , data: err });
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const result = await prisma.patients.create({
      data: { ...req.body },
    });
    logger(false, `Creating Patient Details : `, result);
    res.send({ status: true, data: result });
  } catch (err) {
    logger(true, `Creating Patient Details failed due to `, err)
    res.send({ status: true, message: `Creating Patient Details operation failed due to.`, data: err });
  }
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  const patient_id = parseInt(req.params.id);
  try {
    const updated_patient_details = await prisma.patients.update({
      where: { Id: patient_id },
      data: { ...req.body, ModifiedOn: new Date },
    });
    logger(false, `Updating Patient Details by Id : ${patient_id} `, updated_patient_details);
    res.send({ status: true, data: updated_patient_details });
  } catch (err) {
    logger(false, `Updating Patient Details by Id : ${patient_id} `, err);
    res.send({ status: true, message: `Updating Patient Details by Id : ${patient_id} ` , data: err });
  }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const patient_id = parseInt(req.params.id);
  try {
    const deleted_patient = await prisma.patients.update({
      where: { Id: patient_id },
      data: { IsActive: false },
    });
    logger(false, `Deleting Patient Details by Id : ${patient_id} `, deleted_patient);
    res.send({ status: true, data: deleted_patient });
  } catch (err) {
    logger(true, `Deleting Patient Details operation by Id ${patient_id} failed due to.`, err);
    res.send({ status: false, message: `Deleting Patient Details operation failed due to.` , data: err });
  }
});

export default router;