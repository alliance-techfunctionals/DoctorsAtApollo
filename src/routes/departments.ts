import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma: any = new PrismaClient();
import { logger } from "../utils/utils";

router.get("/", async (req: express.Request, res: express.Response) => {
  const departments = await prisma.departments.findMany({
    where: { IsActive: true },
  });
  logger(false, `Get All Active Departments.`, departments);
  res.send({ status: true, data: departments });
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const department_id = parseInt(req.params.id);
  const department = await prisma.departments.findFirst({
    where: { Id: department_id, IsActive: true },
  });
  logger(false, `Get Active Department by Id ${department_id} .`, department);
  res.send({ status: true, data: department });
});

router.post("/", async (req: express.Request, res: express.Response) => {
  const result = await prisma.departments.create({
    data: { ...req.body },
  });
  logger(false, `Creating Department `, result);
  res.send({ status: true, data: result });
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  const department_id = parseInt(req.params.id);
  const updated_department = await prisma.departments.update({
    where: { Id: department_id },
    data: { ...req.body },
  });
  logger(false, `Updating Department `, updated_department);
  res.send({ status: true, data: updated_department });
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const department_id = parseInt(req.params.id);
  const deleted_department = await prisma.departments.update({
    where: { Id: department_id },
    data: { IsActive: false },
  });
  logger(false, `Deleting Department `, deleted_department);
  res.send({ status: true, data: deleted_department });
});

export default router;
