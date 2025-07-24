import { 
    createCompanyDepartment, 
    getCompanyDepartment, 
    getCompanyDepartmentById, 
    updateCompanyDepartment, 
    deleteCompanyDepartment 
} 
from "../services/company.department.services.js";
export const createCompanyDepartmentController = async (req, res) => {
    const { companyId } = req.params;
    const {name,code,is_active} = req.body;
    const companyDepartmentData = {
        company_id:companyId,
        name:name,
        code:code,
        is_active:is_active
    };
    try {
        const companyDepartment = await createCompanyDepartment(companyDepartmentData);
        if(!companyDepartment){
            res.status(400).json({
                success: false,
                message: "Company department not created",
            });
        }
        res.status(200).json({
            success: true,
            message: "Company department created successfully",
            companyDepartment,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false, 
            message: "Company department not created",
            error: error.message,
        });
    }
}
export const getCompanyDepartmentController = async (req, res) => {
    const { companyId } = req.params;
    try {
        const companyDepartment = await getCompanyDepartment(companyId);
        if(!companyDepartment){
            res.status(400).json({
                success: false,
                message: "Company department not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Company department fetched successfully",
            companyDepartment,
        });
    }catch (error) {
        console.log(error.message); 
        res.status(500).json({
            success: false,
            message: "Company department not fetched",
            error: error.message,
        });
    }
}
export const getCompanyDepartmentByIdController = async (req, res) => {
    const { companyId, departmentId } = req.params;
    try {
        const companyDepartment = await getCompanyDepartmentById(companyId, departmentId);
        if(!companyDepartment){
            res.status(400).json({
                success: false,
                message: "Company department not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Company department fetched successfully",
            companyDepartment,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Company department not fetched",
            error: error.message,
        });
    }
}
export const updateCompanyDepartmentController = async (req, res) => {
    const { companyId, departmentId } = req.params;
  
    try {
        const companyDepartment = await updateCompanyDepartment(companyId, departmentId, req.body);
        if(!companyDepartment){
            res.status(400).json({
                success: false,
                message: "Company department not updated",
            });
        }
        res.status(200).json({
            success: true,
            message: "Company department updated successfully",
            companyDepartment,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Company department not updated",
            error: error.message,
        });
    }
}
export const deleteCompanyDepartmentController = async (req, res) => {
    const { companyId, departmentId } = req.params;
    try {
        const companyDepartment = await deleteCompanyDepartment(companyId, departmentId);
        if(!companyDepartment){
            res.status(400).json({
                success: false,
                message: "Company department not deleted",
            });
        }
        res.status(200).json({
            success: true, 
            message: "Company department deleted successfully",
            companyDepartment,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Company department not deleted",
            error: error.message,
        });
    }
}
