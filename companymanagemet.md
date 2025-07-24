# Company Management Service – Progress Overview

## Project Structure

company_management_service/
├── app.js
├── server.js
├── package.json
├── db/
│   └── db.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── controllers/
│   ├── company.controller.js
│   ├── company.employ.controller.js
│   ├── company.policy.controller.js
│   └── comapny.department.controller.js
├── services/
│   ├── company.service.js
│   ├── company.employ.services.js
│   ├── company.policies.services.js
│   └── company.department.services.js
├── routes/
│   ├── comapny.router.js
│   ├── companies.employee.routre.js
│   ├── company.policy.router.js
│   └── company.department.router.js
├── utils/
├── middleware/
└── README.md

## Implemented Features

### 1. **Company CRUD**
- **Routes:** `/api/company`
- **Controllers/Services:** Create, read (all/by id), update, delete companies.
- **DB Model:** `Company` (Prisma)

### 2. **Employee CRUD**
- **Routes:** `/api/company/employ`
- **Controllers/Services:** Create, read (all/by company/by id), update, delete employees.
- **DB Model:** `CompanyEmployee` (Prisma, composite key: company_id + employee_id)

### 3. **Department CRUD**
- **Routes:** `/api/company/department`
- **Controllers/Services:** Create, read (all/by id), update, delete departments.
- **DB Model:** `Department` (Prisma, linked to company)

### 4. **Policy CRUD**
- **Routes:** `/api/company/policy`
- **Controllers/Services:** Create, read (all/by id), update, delete policies.
- **DB Model:** `CompanyPolicy` (Prisma, linked to company)

### 5. **Database**
- **Prisma ORM** with PostgreSQL.
- **Schema:** Models for Company, CompanyEmployee, Department, CompanyPolicy, CompanySetting.
- **Migrations:** Managed via Prisma.

### 6. **API Layer**
- **Express.js** for routing and middleware.
- **Controllers** handle HTTP logic and error responses.
- **Services** encapsulate business logic and DB access.

### 7. **Other**
- **CORS** and **dotenv** for environment/config management.
- **Project is modular** and follows separation of concerns.


---

## Example Endpoints

- `POST   /api/company/create`
- `GET    /api/company/get`
- `GET    /api/company/get/:id`
- `PUT    /api/company/update/:id`
- `DELETE /api/company/delete/:id`

- `POST   /api/company/employ/create/:companyId`
- `GET    /api/company/employ/get/:companyId`
- `GET    /api/company/employ/get/:companyId/:employeeId`
- `PUT    /api/company/employ/update/:companyId/:employeeId`
- `DELETE /api/company/employ/delete/:companyId/:employeeId`

- `POST   /api/company/department/create/:companyId`
- `GET    /api/company/department/get/:companyId`
- `GET    /api/company/department/get/:companyId/:departmentId`
- `PUT    /api/company/department/update/:companyId/:departmentId`
- `DELETE /api/company/department/delete/:companyId/:departmentId`

- `POST   /api/company/policy/create/:companyId`
- `GET    /api/company/policy/get/:companyId`
- `GET    /api/company/policy/get/:companyId/:policyId`
- `PUT    /api/company/policy/update/:companyId/:policyId`
- `DELETE /api/company/policy/delete/:companyId/:policyId`

---

