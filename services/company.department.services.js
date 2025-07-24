import prisma from "../db/db.js";
export const createCompanyDepartment = async (companyDepartmentData) => {
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
    const companyDepartment = await prisma.department.update({
        where: {
            company_id:companyId,
            id:departmentId
        },
        data:companyDepartmentData
    });
    return companyDepartment;
};
export const deleteCompanyDepartment = async (companyId,departmentId) => { 
    const companyDepartment = await prisma.department.delete({
        where: {
            company_id:companyId,
            id:departmentId
        }
    });
    return companyDepartment;
};