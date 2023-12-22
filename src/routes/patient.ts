import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
import { logger  } from "../utils/utils";
import { decodeJWTToken  } from "../utils/utils";
const prisma = new PrismaClient();

router.get("/", async (req: express.Request, res: express.Response) => {
  let token = decodeJWTToken(req.headers.authorization);
  try {
    const patientDetails: any = await prisma.patients.findMany({
      where: { IsActive: true , DoctorId: token.DoctorId },
    });
    for (let i = 0 ; i < patientDetails.length; i++)  {
      let visits = await prisma.doctorActvities.findMany({
        where: { IsDeleted: false , ActivityTypeId: 0, DoctorId: patientDetails[i].DoctorId },
      });
      let procedures = await prisma.doctorActvities.findMany({
        where: { IsDeleted: false , ActivityTypeId: { not: 0 }, DoctorId: patientDetails[i].DoctorId },
      });
      patientDetails[i]["Visits"] = visits.length;
      patientDetails[i]["Procedures"] = procedures.length;
    }
    logger(false, `Getting Patient Details : `, patientDetails);
    res.send({ status: true, data: patientDetails });
  } catch (err) {
    logger(true, `Getting Patient Details operation failed due to.`, err);
    res.send({ status: false, message: `Getting Patient Details operation failed due to.` , data: err });
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const patient_id = parseInt(req.params.id);
  let doctorActivitiesHistory = await prisma.doctorActvities.findMany({
    where: { PatientId: patient_id, IsDeleted: false }
  });

  let visits, procedures;
  try {
    const patientDetail : any = await prisma.patients.findFirst({
      where: { Id: patient_id, IsActive: true },
    });
    
    visits = doctorActivitiesHistory.filter((doctorActivity) => doctorActivity.ActivityTypeId == 0);
    procedures = doctorActivitiesHistory.filter((doctorActivity) => doctorActivity.ActivityTypeId != 0);
  
    if (req.body.history == "visits") {
      patientDetail["visits"] = visits;
    } else if (req.body.history == "procedures")  {
      patientDetail["procedures"] = procedures;
    } else {
      patientDetail["visits"] = visits;
      patientDetail["procedures"] = procedures;
    }
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
    // check visits, procedures history by patient id
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