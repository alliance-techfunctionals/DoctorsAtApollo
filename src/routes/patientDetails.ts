import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
import { logger  } from "../utils/utils";
const prisma = new PrismaClient();

router.get("/", async (req: express.Request, res: express.Response) => {
  const patientDetails = await prisma.patientDetails.findMany({
    where: { IsActive: true },
  });
  logger(false, `Getting Patient Details : `, patientDetails);
  res.send({ status: true, data: patientDetails });
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const patient_id = parseInt(req.params.id);
  const patientDetail = await prisma.patientDetails.findFirst({
    where: { Id: patient_id, IsActive: true },
  });
  logger(false, `Getting Patient Detail by Id : ${patient_id} `, patientDetail);
  res.send({ status: true, data: patientDetail });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  const result = await prisma.patientDetails.create({
    data: { ...req.body },
  });
  res.send({ status: true, data: result });
  logger(false, `Creating Patient Details : `, result);
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  const patient_id = parseInt(req.params.id);
  const updated_patient_details = await prisma.patientDetails.update({
    where: { Id: patient_id },
    data: { ...req.body, ModifiedOn: new Date },
  });
  logger(false, `Updating Patient Details by Id : ${patient_id} `, updated_patient_details);
  res.send({ status: true, data: updated_patient_details });
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const patient_id = parseInt(req.params.id);
  const deleted_patient = await prisma.patientDetails.update({
    where: { Id: patient_id },
    data: { IsActive: false },
  });
  logger(false, `Deleting Patient Details by Id : ${patient_id} `, deleted_patient);
  res.send({ status: true, data: deleted_patient });
});

export default router;