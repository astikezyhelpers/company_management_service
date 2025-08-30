import prisma from "../db/db.js";
export const createCompany = async (companyData) => {
  const company = await prisma.company.create({
    data: companyData,
  });
  return company;
};
export const getCompany = async () => {
  const company = await prisma.company.findMany();
  return company;
};
export const getCompanyById = async (id) => {
  const company = await prisma.company.findUnique({
    where: { id },
  });
  return company;
};

export const updateCompany = async (id, updateData) => {
  // First check if company exists
  const existingCompany = await prisma.company.findUnique({
    where: { id },
  });

  if (!existingCompany) {
    return null;
  }

  // Update only the provided fields
  const company = await prisma.company.update({
    where: { id },
    data: {
      ...updateData,
      updated_at: new Date(), // Auto-update timestamp
    },
  });
  
  return company;
};
export const deleteCompany = async (id) => {
  const company = await prisma.company.delete({
    where: { id },
  });
  return company;
};  


