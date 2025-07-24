import express from "express";
import { 
    createCompanyDepartmentController,
    getCompanyDepartmentController,
    getCompanyDepartmentByIdController,
    updateCompanyDepartmentController,
    deleteCompanyDepartmentController
} 
from "../controllers/comapny.department.controller.js";
const routerCompanyDepartment = express.Router();
routerCompanyDepartment.post("/create/:companyId", createCompanyDepartmentController);
routerCompanyDepartment.get("/get/:companyId", getCompanyDepartmentController);
routerCompanyDepartment.get("/get/:companyId/:departmentId", getCompanyDepartmentByIdController);
routerCompanyDepartment.put("/update/:companyId/:departmentId", updateCompanyDepartmentController);
routerCompanyDepartment.delete("/delete/:companyId/:departmentId", deleteCompanyDepartmentController);
export default routerCompanyDepartment;
