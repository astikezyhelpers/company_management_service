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
    
    // Validate required fields
    if(!companyId || !employ_id || !user_id || !role || !status){
        return res.status(400).json({
            success: false,
            message: "Company id, user_id, employ_id, role, and status are required",
        });
    }
    
    try { 
        const companyEmployData = {
            company_id: companyId,
            user_id: user_id,
            employee_id: employ_id,
            role: role,
            status: status,
        };
        const companyEmploy = await createCompanyEmploy(companyEmployData);
        return res.status(201).json({
            success: true,
            message: "Company employ created successfully",
            companyEmploy,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({
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
            return res.status(400).json({
                success: false,
                message: "Inavalid CompanyId",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Company employ fetched successfully",
            companyEmploy,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({
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
            return res.status(400).json({
                success: false,
                message: "Inavalid CompanyId or EmployeeId",
            });
        }
        return res.status(200).json({
            success: true,  
            message: "Company employ fetched successfully",
            companyEmploy,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Company employ not fetched",
    })
    }
}
export const updateCompanyEmployeeController = async (req, res) => {
    const { companyId, employeeId } = req.params;
    const updateData = req.body;
    
    // Validate if update data is provided
    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
            success: false,
            message: "No update data provided"
        });
    }

    // Define allowed fields for employee update
    const allowedFields = [
        'user_id', 'designation', 'role', 'budget_limit', 
        'start_date', 'end_date', 'salary_band', 
        'reporting_manager_id', 'employment_type', 'status',
        'department_id'
    ];

    // Filter out only allowed fields
    const filteredData = {};
    Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
            filteredData[key] = updateData[key];
        }
    });

    // Check if any valid fields were provided
    if (Object.keys(filteredData).length === 0) {
        return res.status(400).json({
            success: false,
            message: "No valid fields provided for update"
        });
    }

    try {
        const companyEmploy = await updateCompanyEmployee(companyId, employeeId, filteredData);
        if (!companyEmploy) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            updatedFields: Object.keys(filteredData),
            companyEmploy,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Employee not updated",
            error: error.message,
        });
    }
}
export const deleteCompanyEmployeeController = async (req, res) => {
    const { companyId, employeeId } = req.params;
    try {
        const companyEmploy = await deleteCompanyEmployee(companyId, employeeId);
        if(!companyEmploy){
            return res.status(400).json({
                success: false,
                message: "Inavalid CompanyId or EmployeeId",
            });
        }
        return res.status(200).json({
            success: true,  
            message: "Company employ deleted successfully",
            companyEmploy,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({      
            success: false,
            message: "Company employ not deleted",      
            error: error.message,
        });
    }
}