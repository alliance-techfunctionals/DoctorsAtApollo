import express from "express";
const router = express.Router();
import { logger } from "../utils/utils";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.get("/", async (req: express.Request, res: express.Response) => {
  const procedureTypes = await prisma.procedureTypes.findMany({
    where: { IsActive: 1 },
  });
  logger(false, `Getting procedure types : `, procedureTypes);
  res.send({ status: true, data: procedureTypes });
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const procedureType_id = parseInt(req.params.id);
  const procedureTypeDetail = await prisma.procedureTypes.findFirst({
    where: { Id: procedureType_id, IsActive: 1 },
  });
  logger(false, `Getting procedure type by Id ${procedureType_id} : `, procedureTypeDetail);
  res.send({ status: true, data: procedureTypeDetail });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  const result = await prisma.procedureTypes.create({
    data: { ...req.body },
  });
  logger(false, `Creating procedure type `, result);
  res.send({ status: true, data: result });
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  const procedureType_id = parseInt(req.params.id);
  const updated_procedureType_id = await prisma.procedureTypes.update({
    where: { Id: procedureType_id },
    data: { ...req.body },
  });
  logger(false, `Updating procedure type `, updated_procedureType_id);
  res.send({ status: true, data: updated_procedureType_id });
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const procedureType_id = parseInt(req.params.id);
  const deleted_procedureType_id = await prisma.procedureTypes.update({
    where: { Id: procedureType_id },
    data: { IsActive: 0 },
  });
  logger(false, `Deleting procedure type by ${procedureType_id}`, deleted_procedureType_id);
  res.send({ status: true, data: deleted_procedureType_id });
});

export default router;