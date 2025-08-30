import { 
    createCompanyPolicies,
    getCompanyPolicies,
    getCompanyPolicyById,
    updateCompanyPolicy,
    deleteCompanyPolicy
 } from "../services/company.policies.services.js";
export const createCompanyPolicyController = async (req, res) => {
    const { companyId } = req.params;
  
    const companyPolicyData = req.body;
    try {
        const companyPolicy = await createCompanyPolicies(companyPolicyData);
        if(!companyPolicy){
            return res.status(400).json({
                success: false,
                message: "Company policy not created",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Company policy created successfully",
            companyPolicy,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Company policy not created",
            error: error.message,   
        });
    }
}
export const getCompanyPolicyController = async (req, res) => {
    const { companyId } = req.params;
    try {
        const companyPolicy = await getCompanyPolicies(companyId);
        if(!companyPolicy){
            return res.status(400).json({
                success: false,
                message: "Company policy not found",
            });
        }
        return res.status(200).json({  
            success: true,
            message: "Company policy fetched successfully",
            companyPolicy,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Company policy not fetched",
            error: error.message,
        });
    }
    
}
export const getCompanyPolicyByIdController = async (req, res) => {
    const { companyId, policyId } = req.params;
    try {
        const companyPolicy = await getCompanyPolicyById(companyId, policyId);
        if(!companyPolicy){
            return res.status(400).json({
                success: false,
                message: "Company policy not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Company policy fetched successfully",
            companyPolicy,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Company policy not fetched",
            error: error.message,
        });
    }
}
export const updateCompanyPolicyController = async (req, res) => {
    const { companyId, policyId } = req.params;
  
    try {
        const companyPolicy = await updateCompanyPolicy(companyId, policyId,req.body);
        if(!companyPolicy){
            return res.status(400).json({
                success: false,
                message: "Company policy not updated",
            });
        }
        return res.status(200).json({  
            success: true,
            message: "Company policy updated successfully",
            companyPolicy,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Company policy not updated",
            error: error.message,
        });
    }
}

export const deleteCompanyPolicyController = async (req, res) => {
    const { companyId, policyId } = req.params;
    try {
        const companyPolicy = await deleteCompanyPolicy(companyId, policyId);
        if(!companyPolicy){
            return res.status(400).json({
                success: false,
                message: "Company policy not deleted",
            });
        }
        return res.status(200).json({
            success: true,  
            message: "Company policy deleted successfully",
            companyPolicy,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Company policy not deleted",
            error: error.message,
        });
    }
}
