import { createCompany, getCompany, getCompanyById, updateCompany, deleteCompany } from "../services/company.service.js";
export const createCompanyController = async (req, res) => {
    const companyData = req.body;
    try{
        const company = await createCompany(companyData);
        if (!company) {
            res.status(400).json({
            success: false,
            message: "Company not created"
            })
        }
        res.status(201).json({
            success: true,
            message: "Company created successfully",
            company,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
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
            res.status(400).json({
                success: false,
                message: "Company not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Company fetched successfully",
            company,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
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
            res.status(400).json({
                success: false,
                message: "Company not found"
            })
        }   
        res.status(200).json({
            success: true,
            message: "Company fetched successfully",
            company,
        });
    }catch (error) {    
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Company not fetched",
            error: error.message,
        });
    }
}
export const updateCompanyController = async (req, res) => {
    const { id } = req.params;
    const companyData = req.body;
    try{
        const company = await updateCompany(id, companyData);
        if (!company) {
            res.status(400).json({
                success: false,
                message: "Company not updated"
            })
        }
        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            company,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
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
            res.status(400).json({
                success: false,
                message: "Company not deleted"
            })
        }   
        res.status(200).json({
            success: true,
            message: "Company deleted successfully",
            company,
        });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Company not deleted",
            error: error.message,
        });
    }
}