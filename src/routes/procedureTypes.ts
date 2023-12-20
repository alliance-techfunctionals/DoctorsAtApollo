import express from "express";
const router = express.Router();
import { logger } from "../utils/utils";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const procedureTypes = await prisma.procedureTypes.findMany({
      where: { IsActive: 1 },
    });
    logger(false, `Getting procedure types : `, procedureTypes);
    res.send({ status: true, message: `Getting procedure types.` , data: procedureTypes });
  } catch (err) {
    logger(true, `Getting procedure types : `, err);
    res.send({ status: false, message: `Getting procedure types.` , data: err });
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const procedureType_id = parseInt(req.params.id);
  try {
    const procedureTypeDetail = await prisma.procedureTypes.findFirst({
      where: { Id: procedureType_id, IsActive: 1 },
    });
    logger(false, `Getting procedure type by Id ${procedureType_id} : `, procedureTypeDetail);
    res.send({ status: true, data: procedureTypeDetail });
  } catch (err) {
    logger(true, `Getting procedure type by Id ${procedureType_id} operation failed.`, err);
    res.send({ status: false, message: `Getting procedure type by Id ${procedureType_id} operation failed.` , data: err });
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const result = await prisma.procedureTypes.create({
      data: { ...req.body },
    });
    logger(false, `Creating procedure type `, result);
    res.send({ status: true, data: result });
  } catch (err) {
    logger(true, `Creating procedure types operation failed due to.`, err);
    res.send({ status: false, message: `Creating procedure types operation failed due to.` , data: err });
  }
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  const procedureType_id = parseInt(req.params.id);
  try {
    const updated_procedureType_id = await prisma.procedureTypes.update({
      where: { Id: procedureType_id },
      data: { ...req.body },
    });
    logger(false, `Updating procedure type `, updated_procedureType_id);
    res.send({ status: true, data: updated_procedureType_id });
  } catch (err) {
    logger(true, `Updating procedure type by id ${procedureType_id} operation failed due to.`, err);
    res.send({ status: false, message: `Updating procedure type by id ${procedureType_id} operation failed due to.` , data: err });
  }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const procedureType_id = parseInt(req.params.id);
  try {
    const deleted_procedureType_id = await prisma.procedureTypes.update({
      where: { Id: procedureType_id },
      data: { IsActive: 0 },
    });
    logger(false, `Deleting procedure type by id ${procedureType_id}`, deleted_procedureType_id);
    res.send({ status: true, data: deleted_procedureType_id });
  }
  catch (err) {
    logger(true, `Deleting procedure type by id ${procedureType_id} operation failed due to.`, err);
    res.send({ status: false, message: `Deleting procedure type by id ${procedureType_id} operation failed due to.` , data: err });
  }
});

export default router;