import express from "express";
//import prisma from "./db/db.js";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/company.router.js";
import routerCompanyEmploy from "./routes/company.employee.router.js";
import routerCompanyPolicy from "./routes/company.policy.router.js";
import routerCompanyDepartment from "./routes/company.department.router.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/company", router);
app.use("/api/company/employ", routerCompanyEmploy);
app.use("/api/company/policy", routerCompanyPolicy);
app.use("/api/company/department", routerCompanyDepartment);
export default app;

