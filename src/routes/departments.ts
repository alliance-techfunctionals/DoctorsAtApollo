import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma: any = new PrismaClient();
import { logger } from "../utils/utils";

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const departments = await prisma.departments.findMany({
      where: { IsActive: true },
    });
    logger(false, `Get All Active Departments.`, departments);
    res.send({ status: true, message: "Get All Active Departments.", data: departments });
  } catch (err) {
    logger(true, `Get All Active Departments operation failed due to.`, err);
    res.send({ status: false, message: "Get All Active Departments operation failed due to.", data: err })
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const department_id = parseInt(req.params.id);
    const department = await prisma.departments.findFirst({
      where: { Id: department_id, IsActive: true },
    });
    logger(false, `Get Active Department by Id ${department_id} .`, department);
    res.send({ status: true, message: `Get Active Department by Id ${department_id} .` , data: department });
  } catch (err) {
    logger(true, `Get Active Department operation failed due to.`, err);
    res.send({ status: false, message: "Get Active Department operation failed due to.", data: err })
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const result = await prisma.departments.create({
      data: { ...req.body },
    });
    logger(false, `Creating Department `, result);
    res.send({ status: true, message: "Creating Department." ,  data: result });
  } catch(err) {
    res.send({ status: false, message: "Creating Department failed due to." ,  data: err });
  }
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  const department_id = parseInt(req.params.id);
  try {
    const updated_department = await prisma.departments.update({
      where: { Id: department_id },
      data: { ...req.body },
    });
    logger(false, `Updating Department `, updated_department);
    res.send({ status: true, data: updated_department });
  } catch (err) {
    logger(true, `Updating Department failed due to.`, err);
    res.send({ status: false, message: "Updating Department failed due to.", data: err });
  }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const department_id = parseInt(req.params.id);
  try {
    const deleted_department = await prisma.departments.update({
      where: { Id: department_id },
      data: { IsActive: false },
    });
    logger(false, `Deleting Department `, deleted_department);
    res.send({ status: true, data: deleted_department });
  } catch (err)  {
    logger(true, `Deleting Department failed due to.`, err);
    res.send({ status: false, message: `Deleting Department failed due to.` , data: err });
  }
});

export default router;
