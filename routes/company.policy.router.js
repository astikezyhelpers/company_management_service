import express from "express";
import { 
    createCompanyPolicyController,
    getCompanyPolicyController,
    getCompanyPolicyByIdController,
    updateCompanyPolicyController,
    deleteCompanyPolicyController
} 
from "../controllers/company.policy.controller.js";
import validate from "../middleware/validator.js";
import { authenticateToken, authorizeCompanyAccess } from "../middleware/auth.js";
import { policyValidation, updatePolicySchema } from "../validations/policy.validation.js";

const routerCompanyPolicy = express.Router();
routerCompanyPolicy.post("/create/:companyId", authenticateToken, authorizeCompanyAccess, validate(policyValidation), createCompanyPolicyController);
routerCompanyPolicy.get("/get/:companyId", authenticateToken, authorizeCompanyAccess, getCompanyPolicyController);
routerCompanyPolicy.get("/get/:companyId/:policyId", authenticateToken, authorizeCompanyAccess, getCompanyPolicyByIdController);
routerCompanyPolicy.put("/update/:companyId/:policyId", authenticateToken, authorizeCompanyAccess, validate(updatePolicySchema), updateCompanyPolicyController);
routerCompanyPolicy.delete("/delete/:companyId/:policyId", authenticateToken, authorizeCompanyAccess, deleteCompanyPolicyController);
export default routerCompanyPolicy;
