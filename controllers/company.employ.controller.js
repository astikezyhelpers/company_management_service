import {
  createCompanyEmploy,
  getCompanyEmploy,
  getCompanyEmployeeById,
  updateCompanyEmployee,
  deleteCompanyEmployee
} from "../services/company.employ.services.js";
import { AppError } from "../utils/Apperror.js";

export const createCompanyEmployController = async (req, res, next) => {
  const { companyId } = req.params;
  const { user_id, employee_id, role, status } = req.body;

  try {
    // Validate required fields
    if (!companyId || !employee_id || !user_id || !role || !status) {
      throw new AppError(
        400,
        "Company id, user_id, employ_id, role, and status are required"
      );
    }

    const companyEmployData = {company_id: companyId,
      ...req.body
    } 
  

    const companyEmploy = await createCompanyEmploy(companyEmployData);

    res.status(201).json({
      success: true,
      message: "Company employee created successfully",
      data: companyEmploy
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyEmployeeController = async (req, res, next) => {
  const { companyId } = req.params;

  try {
    const companyEmploy = await getCompanyEmploy(companyId);

    if (!companyEmploy || companyEmploy.length === 0) {
      throw new AppError(404,"Invalid CompanyId or no employees found");
    }

    res.status(200).json({
      success: true,
      message: "Company employees fetched successfully",
      data: companyEmploy
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyEmployeeByIdController = async (req, res, next) => {
  const { companyId, employeeId } = req.params;

  try {
    const companyEmploy = await getCompanyEmployeeById(companyId, employeeId);

    if (!companyEmploy) {
      throw new AppError(404,"Invalid CompanyId or EmployeeId");
    }

    res.status(200).json({
      success: true,
      message: "Company employee fetched successfully",
      data: companyEmploy
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyEmployeeController = async (req, res, next) => {
  const { companyId, employeeId } = req.params;
  const updateData = req.body;

  try {
    // Validate if update data is provided
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new AppError(400,"No update data provided");
    }

    // Define allowed fields
    const allowedFields = [
      "user_id",
      "designation",
      "role",
      "budget_limit",
      "start_date",
      "end_date",
      "salary_band",
      "reporting_manager_id",
      "employment_type",
      "status",
      "department_id"
    ];

    // Keep only valid fields
    const filteredData = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      throw new AppError(400,"No valid fields provided for update");
    }

    const companyEmploy = await updateCompanyEmployee(
      companyId,
      employeeId,
      filteredData
    );

    if (!companyEmploy) {
      throw new AppError(404,"Employee not found");
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      updatedFields: Object.keys(filteredData),
      data: companyEmploy
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCompanyEmployeeController = async (req, res, next) => {
  const { companyId, employeeId } = req.params;

  try {
    const companyEmploy = await deleteCompanyEmployee(companyId, employeeId);

    if (!companyEmploy) {
      throw new AppError(404,"Invalid CompanyId or EmployeeId");
    }

    res.status(200).json({
      success: true,
      message: "Company employee deleted successfully",
      data: companyEmploy
    });
  } catch (error) {
    next(error);
  }
};
