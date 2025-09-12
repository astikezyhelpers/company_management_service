import prisma from "../db/db.js";
export const createCompanyDepartment = async (companyDepartmentData) => {
    // Validate that company_id is provided
    if (!companyDepartmentData.company_id) {
        throw new Error("company_id is required");
    }
    
    const companyDepartment = await prisma.department.create({
        data: companyDepartmentData,
    });
    return companyDepartment;
};
export const getCompanyDepartment = async (companyId) => {
    const companyDepartment = await prisma.department.findMany({
        where: {
            company_id:companyId,
        },
    });
    return companyDepartment;
};
export const getCompanyDepartmentById = async (companyId,departmentId) => {
    const companyDepartment = await prisma.department.findFirst({
        where: {
            company_id:companyId,
            id:departmentId
        },
    });
    return companyDepartment;
};
export const updateCompanyDepartment = async (companyId,departmentId,companyDepartmentData) => {
    // First check if department exists
    const existingDepartment = await prisma.department.findFirst({
        where: {
            company_id: companyId,
            id: departmentId
        }
    });

    if (!existingDepartment) {
        return null;
    }

    // Update only the provided fields and auto-update timestamp
    const companyDepartment = await prisma.department.update({
        where: {
            id: departmentId
        },
        data: {
            ...companyDepartmentData,
            updated_at: new Date(), // Auto-update timestamp
        }
    });
    return companyDepartment;
};
export const deleteCompanyDepartment = async (companyId,departmentId) => { 
    const companyDepartment = await prisma.department.delete({
        where: {
            id: departmentId
        }
    });
    return companyDepartment;
};