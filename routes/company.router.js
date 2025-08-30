import express from "express";
import { createCompanyController, getCompanyController, getCompanyByIdController, updateCompanyController, deleteCompanyController } from "../controllers/company.controller.js";
const router = express.Router();
router.post("/create", createCompanyController);
router.get("/get", getCompanyController);
router.get("/get/:id", getCompanyByIdController);
router.put("/update/:id", updateCompanyController);
router.delete("/delete/:id", deleteCompanyController);
export default router;
