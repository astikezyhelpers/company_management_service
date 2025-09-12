import express from "express";
import { createCompanyController, getCompanyController, getCompanyByIdController, updateCompanyController, deleteCompanyController } from "../controllers/company.controller.js";
import validate from "../middleware/validator.js";
import { authenticateToken } from "../middleware/auth.js";
import {companyValidation,updateCompanySchema}  from "../validations/company.validation.js";


const router = express.Router();
router.post("/create",authenticateToken, validate(companyValidation), createCompanyController);
router.get("/get", authenticateToken, getCompanyController);
router.get("/get/:id", authenticateToken, getCompanyByIdController);
router.put("/update/:id",authenticateToken, validate(updateCompanySchema), updateCompanyController);
router.delete("/delete/:id", authenticateToken, deleteCompanyController);
export default router;
