import express from "express";
import { 
    createCompanyPolicyController,
    getCompanyPolicyController,
    getCompanyPolicyByIdController,
    updateCompanyPolicyController,
    deleteCompanyPolicyController
 } 
from "../controllers/company.policy.controller.js";
const routerCompanyPolicy = express.Router();
routerCompanyPolicy.post("/create/:companyId", createCompanyPolicyController);
routerCompanyPolicy.get("/get/:companyId", getCompanyPolicyController);
routerCompanyPolicy.get("/get/:companyId/:policyId", getCompanyPolicyByIdController);
routerCompanyPolicy.put("/update/:companyId/:policyId", updateCompanyPolicyController);
routerCompanyPolicy.delete("/delete/:companyId/:policyId", deleteCompanyPolicyController);
export default routerCompanyPolicy;
