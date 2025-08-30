import prisma from "../db/db.js";

export const createCompanyEmploy = async (companyEmployData) => {
    const companyEmploy = await prisma.companyEmployee.create({
        data: companyEmployData,
    });
    return companyEmploy;
};
export const getCompanyEmploy = async (companyId) => {
    const companyEmploy = await prisma.companyEmployee.findMany({
        where: {
            company_id:companyId,
        },
    });
    return companyEmploy;
};
export const getCompanyEmployeeById = async (companyId,employeeId) => {
    const companyEmploy = await prisma.companyEmployee.findUnique({
        where: {
            company_id_employee_id:{
                company_id:companyId,
                employee_id:employeeId
            }
        }
    });
    return companyEmploy;
}; 
export const updateCompanyEmployee = async (companyId, employeeId, updateData) => {
    // First check if employee exists
    const existingEmployee = await prisma.companyEmployee.findUnique({
        where: {
            company_id_employee_id: {
                company_id: companyId,
                employee_id: employeeId
            }
        }
    });

    if (!existingEmployee) {
        return null;
    }

    // Update only the provided fields
    const companyEmploy = await prisma.companyEmployee.update({
        where: {
            company_id_employee_id: {
                company_id: companyId,
                employee_id: employeeId
            }
        },
        data: {
            ...updateData,
            updated_at: new Date(), // Auto-update timestamp
        },
    });
    
    return companyEmploy;
};
export const deleteCompanyEmployee = async (companyId,employeeId) => {
    const companyEmploy = await prisma.companyEmployee.delete({
        where: {
            company_id_employee_id:{
                company_id:companyId,
                employee_id:employeeId
            }
        }
    });
    return companyEmploy;
};
      