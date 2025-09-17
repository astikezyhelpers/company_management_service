// controllers/company.department.controller.js
import {
  createCompanyDepartment,
  getCompanyDepartment,
  getCompanyDepartmentById,
  updateCompanyDepartment,
  deleteCompanyDepartment
} from "../services/company.department.services.js";
import { AppError } from "../utils/Apperror.js";
import logger from "../logger.js"; 

export const createCompanyDepartmentController = async (req, res, next) => {
  const { companyId } = req.params;
  const companyDepartmentData = req.body;

  try {
    // Add company_id to request body
    const departmentDataWithCompanyId = {
      ...companyDepartmentData,
      company_id: companyId
    };

    const companyDepartment = await createCompanyDepartment(
      departmentDataWithCompanyId
    );

    if (!companyDepartment) {
      throw new AppError(400,"Company department not created");
    }

    res.status(201).json({
      success: true,
      message: "Company department created successfully",
      data: companyDepartment
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyDepartmentController = async (req, res, next) => {
  const { companyId } = req.params;

  try {
    const companyDepartment = await getCompanyDepartment(companyId);

    if (!companyDepartment || companyDepartment.length === 0) {
      throw new AppError(404,"No departments found for this company");
    }

    res.status(200).json({
      success: true,
      message: "Company departments fetched successfully",
      data: companyDepartment
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyDepartmentByIdController = async (req, res, next) => {
  const { companyId, departmentId } = req.params;

  try {
    const companyDepartment = await getCompanyDepartmentById(
      companyId,
      departmentId
    );

    if (!companyDepartment) {
      throw new AppError(404,"Company department not found");
    }

    res.status(200).json({
      success: true,
      message: "Company department fetched successfully",
      data: companyDepartment
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyDepartmentController = async (req, res, next) => {
  const { companyId, departmentId } = req.params;

  try {
    const companyDepartment = await updateCompanyDepartment(
      companyId,
      departmentId,
      req.body
    );

    if (!companyDepartment) {
      throw new AppError(404,"Company department not found or not updated");
    }

    res.status(200).json({
      success: true,
      message: "Company department updated successfully",
      data: companyDepartment
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCompanyDepartmentController = async (req, res, next) => {
  const { companyId, departmentId } = req.params;

  try {
    const companyDepartment = await deleteCompanyDepartment(
      companyId,
      departmentId
    );

    if (!companyDepartment) {
      throw new AppError(404,"Company department not found or not deleted");
    }

    res.status(200).json({
      success: true,
      message: "Company department deleted successfully",
      data: companyDepartment
    });
  } catch (error) {
    next(error);
  }
};
