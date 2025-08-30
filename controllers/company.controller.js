import { createCompany, getCompany, getCompanyById, updateCompany, deleteCompany } from "../services/company.service.js";
export const createCompanyController = async (req, res) => {
    const companyData = req.body;
    try{
        const company = await createCompany(companyData);
        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Company not created"
            });
        }
        return res.status(201).json({
            success: true,
            message: "Company created successfully",
            company,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Company not created",
            error: error.message,
        });
    }
}
export const getCompanyController = async (req, res) => {
    try{
        const company = await getCompany();
        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Company fetched successfully",
            company,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Company not fetched",
            error: error.message,
        });
    }
}
export const getCompanyByIdController = async (req, res) => {
    const { id } = req.params;
    try{
        const company = await getCompanyById(id);
        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            })
        }   
        return res.status(200).json({
            success: true,
            message: "Company fetched successfully",
            company,
        });
    }catch (error) {    
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Company not fetched",
            error: error.message,
        });
    }
}
export const updateCompanyController = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate if update data is provided
    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
            success: false,
            message: "No update data provided"
        });
    }

    // Define allowed fields for update
    const allowedFields = [
        'name', 'email', 'phone', 'website', 'industry', 
        'address', 'logo_url', 'status', 'subscription_tier', 
        'billing_info', 'settings'
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
        const company = await updateCompany(id, filteredData);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Company updated successfully",
            updatedFields: Object.keys(filteredData),
            company,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Company not updated",
            error: error.message,
        });
    }
}
export const deleteCompanyController = async (req, res) => {
    const { id } = req.params;
    try{
        const company = await deleteCompany(id);
        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Company not deleted"
            })
        }   
        return res.status(200).json({
            success: true,
            message: "Company deleted successfully",
            company,
        });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Company not deleted",
            error: error.message,
        });
    }
}