import express from "express";
import { 
    createCompanyEmployController, 
    getCompanyEmployeeController, 
    getCompanyEmployeeByIdController, 
    updateCompanyEmployeeController,
    deleteCompanyEmployeeController 
  } 
from "../controllers/company.employ.controller.js";
import validate from "../middleware/validator.js";
import { authenticateToken, authorizeCompanyAccess } from "../middleware/auth.js";
import { employeeValidation, updateEmployeeSchema } from "../validations/employee.validation.js";

const routerCompanyEmploy = express.Router();
routerCompanyEmploy.post("/create/:companyId",authenticateToken,authorizeCompanyAccess,validate(employeeValidation), createCompanyEmployController);
routerCompanyEmploy.get("/get/:companyId",authenticateToken,authorizeCompanyAccess,getCompanyEmployeeController);
routerCompanyEmploy.get("/get/:companyId/:employeeId",authenticateToken,authorizeCompanyAccess,getCompanyEmployeeByIdController);
routerCompanyEmploy.put("/update/:companyId/:employeeId",authenticateToken,authorizeCompanyAccess,validate(updateEmployeeSchema), updateCompanyEmployeeController);
routerCompanyEmploy.delete("/delete/:companyId/:employeeId",authenticateToken,authorizeCompanyAccess,deleteCompanyEmployeeController);
export default routerCompanyEmploy;