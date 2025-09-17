import express from "express";
import { 
    createCompanyDepartmentController,
    getCompanyDepartmentController,
    getCompanyDepartmentByIdController,
    updateCompanyDepartmentController,
    deleteCompanyDepartmentController
} 
from "../controllers/company.department.controller.js";
import validate from "../middleware/validator.js";
import { authenticateToken, authorizeCompanyAccess } from "../middleware/auth.js";
import { departmentValidation, updateDepartmentSchema } from "../validations/department.validation.js";

const routerCompanyDepartment = express.Router();
routerCompanyDepartment.post("/create/:companyId",authenticateToken,authorizeCompanyAccess,validate(departmentValidation), createCompanyDepartmentController);
routerCompanyDepartment.get("/get/:companyId",authenticateToken,authorizeCompanyAccess,getCompanyDepartmentController);
routerCompanyDepartment.get("/get/:companyId/:departmentId",authenticateToken,authorizeCompanyAccess,getCompanyDepartmentByIdController);
routerCompanyDepartment.put("/update/:companyId/:departmentId",authenticateToken,authorizeCompanyAccess,validate(updateDepartmentSchema), updateCompanyDepartmentController);
routerCompanyDepartment.delete("/delete/:companyId/:departmentId",authenticateToken,authorizeCompanyAccess,deleteCompanyDepartmentController);
export default routerCompanyDepartment;
