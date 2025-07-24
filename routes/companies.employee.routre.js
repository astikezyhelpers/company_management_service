import express from "express";
import { 
    createCompanyEmployController, 
    getCompanyEmployeeController, 
    getCompanyEmployeeByIdController, 
    updateCompanyEmployeeController,
    deleteCompanyEmployeeController 
  } 
from "../controllers/company.employ.controller.js";
const routerCompanyEmploy = express.Router();
routerCompanyEmploy.post("/create/:companyId", createCompanyEmployController);
routerCompanyEmploy.get("/get/:companyId", getCompanyEmployeeController);
routerCompanyEmploy.get("/get/:companyId/:employeeId", getCompanyEmployeeByIdController);
routerCompanyEmploy.put("/update/:companyId/:employeeId", updateCompanyEmployeeController);
routerCompanyEmploy.delete("/delete/:companyId/:employeeId", deleteCompanyEmployeeController);
export default routerCompanyEmploy;