import 
{ 
    createCompanyEmploy, 
    getCompanyEmploy, 
    getCompanyEmployeeById,
    updateCompanyEmployee ,
    deleteCompanyEmployee
} 
from "../services/company.employ.services.js";
export const createCompanyEmployController = async (req, res) => {
    const { companyId } = req.params;
    const {user_id,employ_id,role,status} = req.body;
    console.log(companyId,employ_id);
    if(!companyId || !employ_id){
        res.status(400).json({
            success: false,
            message: "Company id and employ id are required",
        });
    }
    try { 
        const companyEmployData = {
            company_id:companyId,
            user_id:user_id,
            employee_id:employ_id,
            role:role,
            status:status,
        };
        const companyEmploy = await createCompanyEmploy(companyEmployData);
        res.status(200).json({
            success: true,
            message: "Company employ created successfully",
            companyEmploy,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Company employ not created",
            error: error.message,
        });
    }
    
}
export const getCompanyEmployeeController = async (req, res) => {
    const { companyId } = req.params;
    try {
        const companyEmploy = await getCompanyEmploy(companyId);
        if(!companyEmploy){
            res.status(400).json({
                success: false,
                message: "Inavalid CompanyId",
            });
        }
        res.status(200).json({
            success: true,
            message: "Company employ fetched successfully",
            companyEmploy,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,     
            message: "Company employ not fetched",
            error: error.message,
        });
    }
    
}
export const getCompanyEmployeeByIdController = async (req, res) => {
    const { companyId, employeeId } = req.params;
    try {
        const companyEmploy = await getCompanyEmployeeById(companyId, employeeId);
        if(!companyEmploy){
            res.status(400).json({
                success: false,
                message: "Inavalid CompanyId or EmployeeId",
            });
        }
        res.status(200).json({
            success: true,  
            message: "Company employ fetched successfully",
            companyEmploy,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Company employ not fetched",
    })
    }
}
export const updateCompanyEmployeeController = async (req, res) => {
    const { companyId, employeeId } = req.params;
    const {employ_id,role,status} = req.body;
    try {
        const companyEmployData = {
            role:role,
            status:status,
        };
        const companyEmploy = await updateCompanyEmployee(companyId,employeeId,companyEmployData);
        if(!companyEmploy){
            res.status(400).json({
                success: false,
                message: "Inavalid CompanyId or EmployeeId",
            });
        }
        res.status(200).json({
            success: true,
            message: "Company employ updated successfully",
            companyEmploy,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({      
            success: false,
            message: "Company employ not updated",
            error: error.message,
        });
    }
}
export const deleteCompanyEmployeeController = async (req, res) => {
    const { companyId, employeeId } = req.params;
    try {
        const companyEmploy = await deleteCompanyEmployee(companyId, employeeId);
        if(!companyEmploy){
            res.status(400).json({
                success: false,
                message: "Inavalid CompanyId or EmployeeId",
            });
        }
        res.status(200).json({
            success: true,  
            message: "Company employ deleted successfully",
            companyEmploy,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({      
            success: false,
            message: "Company employ not deleted",      
            error: error.message,
        });
    }
}