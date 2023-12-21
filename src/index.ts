import express from "express";
const app = express();
import dotenv from "dotenv";
import { logger } from "./utils/utils";
dotenv.config({ path: `.env` });

// Body Parser
let bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" })); // Support JSON Encoded Bodies

// Defining Routers
import departments from "./routes/departments";
import doctors from "./routes/doctors"
import doctorActivities from "./routes/doctorActivities";
import patients from "./routes/patient";
import procedureTypes  from "./routes/procedureTypes";
import auth from "./routes/auth";
import JWT_MiddleWare from "./middleware/JWT_Middleware";


app.use("/departments" , departments);
app.use("/doctors", doctors);
app.use("/patients"  , patients);
app.use("/doctorActivities" , doctorActivities);
app.use("/procedures" , procedureTypes);
app.use("/auth" , auth);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/status", (req, res) => {
  res.json({health: true});
});

const port = process.env.PORT;
app.listen(port, () => {
  logger(false, `Application running on port ${port} .`);
});
