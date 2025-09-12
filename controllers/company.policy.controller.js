import { 
    createCompanyPolicies,
    getCompanyPolicies,
    getCompanyPolicyById,
    updateCompanyPolicy,
    deleteCompanyPolicy
} from "../services/company.policies.services.js";
import { AppError } from "../utils/Apperror.js";

// Create Policy
export const createCompanyPolicyController = async (req, res, next) => {
    try {
        const { companyId } = req.params;
        const companyPolicyData = req.body;

        if (!companyId) {
            throw new AppError(400,"Company ID is required");
        }
        if (!companyPolicyData || Object.keys(companyPolicyData).length === 0) {
            throw new AppError(400,"Policy data is required");
        }

        const companyPolicy = await createCompanyPolicies({
            ...companyPolicyData,
            company_id: companyId
        });

        if (!companyPolicy) {
            throw new AppError(400,"Company policy not created");
        }

        res.status(201).json({
            success: true,
            message: "Company policy created successfully",
            companyPolicy,
        });
    } catch (error) {
        next(error);
    }
};

// Get All Policies by Company
export const getCompanyPolicyController = async (req, res, next) => {
    try {
        const { companyId } = req.params;

        if (!companyId) {
            throw new AppError(400,"Company ID is required");
        }

        const companyPolicy = await getCompanyPolicies(companyId);

        if (!companyPolicy || companyPolicy.length === 0) {
            throw new AppError(404,"No policies found for this company");
        }

        res.status(200).json({
            success: true,
            message: "Company policies fetched successfully",
            companyPolicy,
        });
    } catch (error) {
        next(error);
    }
};

// Get Single Policy by ID
export const getCompanyPolicyByIdController = async (req, res, next) => {
    try {
        const { companyId, policyId } = req.params;

        if (!companyId || !policyId) {
            throw new AppError(400,"Company ID and Policy ID are required");
        }

        const companyPolicy = await getCompanyPolicyById(companyId, policyId);

        if (!companyPolicy) {
            throw new AppError(404,"Company policy not found");
        }

        res.status(200).json({
            success: true,
            message: "Company policy fetched successfully",
            companyPolicy,
        });
    } catch (error) {
        next(error);
    }
};

// Update Policy
export const updateCompanyPolicyController = async (req, res, next) => {
    try {
        const { companyId, policyId } = req.params;
        const updateData = req.body;

        if (!companyId || !policyId) {
            throw new AppError(400,"Company ID and Policy ID are required");
        }
        if (!updateData || Object.keys(updateData).length === 0) {
            throw new AppError(400,"No update data provided");
        }

        const companyPolicy = await updateCompanyPolicy(companyId, policyId, updateData);

        if (!companyPolicy) {
            throw new AppError(404,"Company policy not found");
        }

        res.status(200).json({
            success: true,
            message: "Company policy updated successfully",
            companyPolicy,
        });
    } catch (error) {
        next(error);
    }
};

// Delete Policy
export const deleteCompanyPolicyController = async (req, res, next) => {
    try {
        const { companyId, policyId } = req.params;

        if (!companyId || !policyId) {
            throw new AppError(400,"Company ID and Policy ID are required");
        }

        const companyPolicy = await deleteCompanyPolicy(companyId, policyId);

        if (!companyPolicy) {
            throw new AppError(404,"Company policy not found");
        }

        res.status(200).json({
            success: true,
            message: "Company policy deleted successfully",
            companyPolicy,
        });
    } catch (error) {
        next(error);
    }
};
