import prisma from "../db/db.js";
export const createCompanyPolicies = async (companyPoliciesData) => {
    const companyPolicies = await prisma.companyPolicy.create({
        data: companyPoliciesData,
    });
    return companyPolicies;
};
export const getCompanyPolicies = async (companyId) => {
    const companyPolicies = await prisma.companyPolicy.findMany({
        where: {
            company_id:companyId,
        },
    });
    return companyPolicies;
};  
export const getCompanyPolicyById = async (companyId,policyId) => {
    const companyPolicy = await prisma.companyPolicy.findFirst({
        where: {
            
                company_id:companyId,
                id:policyId
            }
        
    });
    return companyPolicy;
};
export const updateCompanyPolicy = async (companyId,policyId,companyPolicyData) => {
    const companyPolicy = await prisma.companyPolicy.update({
        where: {
                company_id:companyId,
                id:policyId
            },
        
        data:companyPolicyData
    });
    return companyPolicy;
};
export const deleteCompanyPolicy = async (companyId,policyId) => {
    const companyPolicy = await prisma.companyPolicy.delete({
        where: {
            company_id:companyId,
            id:policyId
        }
    });
    return companyPolicy;
};


