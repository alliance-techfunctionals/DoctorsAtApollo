import express from "express";
const app = express();
import dotenv from "dotenv";
import { logger } from "./utils/utils";
dotenv.config({ path: `.env` });

// Body Parser
let bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" })); // Support JSON Encoded Bodies

// Defining Routers
import departmentsRouter from "./routes/departments";
import doctorDetailsRouter from "./routes/doctorDetails"
import doctorActivitiesRouter from "./routes/doctorActivities";
import patientDetailsRouter from "./routes/patientDetails";
import procedureTypesRouter  from "./routes/procedureTypes";
import auth from "./routes/auth";
import JWT_MiddleWare from "./middleware/JWT_Middleware";


app.use("/departments" , departmentsRouter);
app.use("/doctorDetails" , doctorDetailsRouter);
app.use("/doctorActivities" , doctorActivitiesRouter);
app.use("/patientDetails" , patientDetailsRouter);
app.use("/procedureTypes" , procedureTypesRouter);
app.use("/auth" , auth);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT;
app.listen(port, () => {
  logger(false, `Application running on port ${port} .`);
});
