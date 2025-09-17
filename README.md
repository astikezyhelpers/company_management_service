# Company Management Service API

A comprehensive Node.js REST API for managing companies, employees, departments, and policies with JWT authentication and authorization.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Environment Setup:**
```bash
cp .env.sample .env
```

3. **Configure your `.env` file:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/company_management_db"
DIRECT_URL="postgresql://username:password@localhost:5432/company_management_db"
PORT=3002
NODE_ENV=development
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
JWT_EXPIRES_IN="24h"
```

4. **Database Setup:**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Start the server:**
```bash
npm start
```

## 🔐 Authentication & Authorization

### JWT Token Generation

Create `generate-token.js`:
```javascript
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const payload = {
    id: "user-uuid-here",
    email: "test@example.com",
    name: "Test User"
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
console.log("JWT Token:", token);
```

**Run:**
```bash
node generate-token.js
```

**Use the token in requests:**
```bash
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## 📚 API Endpoints

### Base URL: `http://localhost:3002/api`

---

## 🏢 Company Management

### Create Company
```http
POST /company/create
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "name": "Tech Corp",
    "registration_number": "REG123456789",
    "email": "contact@techcorp.com",
    "phone": "+1234567890",
    "website": "https://techcorp.com",
    "industry": "Technology",
    "address": {
        "street": "123 Tech Street",
        "city": "Silicon Valley",
        "state": "CA",
        "zip": "94105",
        "country": "USA"
    },
    "logo_url": "https://techcorp.com/logo.png",
    "status": "active",
    "subscription_tier": "premium",
    "billing_info": {
        "tax_id": "TAX123456"
    },
    "settings": {
        "timezone": "PST",
        "currency": "USD"
    },
    "created_by": "admin-user-id",
    "version": 1
}
```

### Get All Companies
```http
GET /company/get
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Company by ID
```http
GET /company/get/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Company
```http
PUT /company/update/:id
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "name": "Updated Tech Corp",
    "status": "active",
    "subscription_tier": "enterprise",
    "version": 2
}
```

### Delete Company
```http
DELETE /company/delete/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 👥 Employee Management

### Create Employee
```http
POST /company/employ/create/:companyId
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "user_id": "USER1234",
    "employee_id": "EMP001",
    "department_id": "department-uuid-here",
    "designation": "Software Engineer",
    "role": "developer",
    "budget_limit": 5000.00,
    "start_date": "2024-01-15T00:00:00Z",
    "end_date": "2025-01-15T00:00:00Z",
    "salary_band": "L3",
    "reporting_manager_id": "manager-uuid-here",
    "employment_type": "full_time",
    "status": "active"
}
```

### Get All Employees
```http
GET /company/employ/get/:companyId
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Employee by ID
```http
GET /company/employ/get/:companyId/:employeeId
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Employee
```http
PUT /company/employ/update/:companyId/:employeeId
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "designation": "Senior Software Engineer",
    "role": "senior_developer",
    "budget_limit": 7500.00,
    "salary_band": "L4",
    "status": "active"
}
```

### Delete Employee
```http
DELETE /company/employ/delete/:companyId/:employeeId
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🏬 Department Management

### Create Department
```http
POST /company/department/create/:companyId
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "name": "Engineering",
    "description": "Software development team",
    "code": "ENG",
    "cost_center": "CC001",
    "budget_allocated": 100000.00,
    "budget_used": 25000.00,
    "manager_id": "employee-uuid-here",
    "parent_id": "parent-department-uuid",
    "level": 1,
    "path": "/engineering",
    "is_active": true
}
```

### Get All Departments
```http
GET /company/department/get/:companyId
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Department by ID
```http
GET /company/department/get/:companyId/:departmentId
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Department
```http
PUT /company/department/update/:companyId/:departmentId
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "name": "Software Engineering",
    "description": "Advanced software development team",
    "budget_allocated": 150000.00,
    "is_active": true
}
```

### Delete Department
```http
DELETE /company/department/delete/:companyId/:departmentId
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📋 Policy Management

### Create Policy
```http
POST /company/policy/create/:companyId
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "policy_type": "HR",
    "name": "Remote Work Policy",
    "description": "Guidelines for remote work arrangements",
    "rules": {
        "max_remote_days": 3,
        "approval_required": true,
        "equipment_provided": true
    },
    "is_active": true,
    "priority": 1,
    "effective_from": "2024-01-01T00:00:00Z",
    "effective_to": "2024-12-31T23:59:59Z",
    "created_by": "hr-manager-uuid",
    "approved_by": "ceo-uuid",
    "approval_date": "2023-12-15T10:00:00Z",
    "version": 1
}
```

### Get All Policies
```http
GET /company/policy/get/:companyId
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Policy by ID
```http
GET /company/policy/get/:companyId/:policyId
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Policy
```http
PUT /company/policy/update/:companyId/:policyId
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
    "name": "Updated Remote Work Policy",
    "description": "Updated guidelines",
    "is_active": true,
    "priority": 2,
    "version": 2
}
```

### Delete Policy
```http
DELETE /company/policy/delete/:companyId/:policyId
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔧 Testing with Postman/Thunder Client

### 1. Set Environment Variables
```
BASE_URL = http://localhost:3002/api
JWT_TOKEN = your-generated-jwt-token
```

### 2. Add Authorization Header
For all protected routes, add:
```
Authorization: Bearer {{JWT_TOKEN}}
```

### 3. Sample Test Flow
1. **Generate JWT token** using the script
2. **Create a company** (save the company ID)
3. **Create a department** using the company ID
4. **Create an employee** using company ID and department ID
5. **Create a policy** using the company ID
6. **Test GET, PUT, DELETE operations**

---

## 📊 Data Models

### Company
```javascript
{
    id: "uuid",
    name: "string (required)",
    registration_number: "string (required)",
    email: "string (required)",
    phone: "string",
    website: "string",
    industry: "string",
    address: "json object",
    logo_url: "string",
    status: "string (required)",
    subscription_tier: "string (required)",
    billing_info: "json object",
    settings: "json object",
    created_by: "string",
    updated_by: "string",
    version: "number",
    created_at: "datetime",
    updated_at: "datetime"
}
```

### Employee
```javascript
{
    id: "uuid",
    company_id: "uuid (required)",
    user_id: "string (required)",
    employee_id: "string (required)",
    department_id: "uuid",
    designation: "string",
    role: "string (required)",
    budget_limit: "number",
    start_date: "datetime",
    end_date: "datetime",
    salary_band: "string",
    reporting_manager_id: "string",
    employment_type: "string",
    status: "string (required)",
    created_at: "datetime",
    updated_at: "datetime"
}
```

### Department
```javascript
{
    id: "uuid",
    company_id: "uuid (required)",
    name: "string (required)",
    description: "string",
    code: "string (required)",
    cost_center: "string",
    budget_allocated: "number",
    budget_used: "number",
    manager_id: "string",
    parent_id: "string",
    level: "number",
    path: "string",
    is_active: "boolean",
    created_at: "datetime",
    updated_at: "datetime"
}
```

### Policy
```javascript
{
    id: "uuid",
    company_id: "uuid (required)",
    policy_type: "string (required)",
    name: "string (required)",
    description: "string",
    rules: "json object",
    is_active: "boolean",
    priority: "number",
    effective_from: "datetime",
    effective_to: "datetime",
    created_by: "string",
    approved_by: "string",
    approval_date: "datetime",
    version: "number",
    created_at: "datetime",
    updated_at: "datetime"
}
```

---

## ⚠️ Error Responses

### Common Error Formats
```javascript
// Validation Error
{
    "error": "Validation failed",
    "details": ["field is required", "field must be a valid email"]
}

// Authentication Error
{
    "error": "Access token required"
}

// Authorization Error  
{
    "error": "Access denied - You do not have access to this company"
}

// Not Found Error
{
    "error": "Resource not found"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Missing/Invalid Token)
- `403` - Forbidden (Access Denied)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🛠️ Development

### Project Structure
```
├── controllers/          # Route handlers
├── db/                  # Database connection
├── middleware/          # Auth, validation, error handling
├── prisma/             # Database schema and migrations
├── routes/             # API route definitions
├── services/           # Business logic
├── utils/              # Utility functions
├── validations/        # Joi validation schemas
├── app.js              # Express app setup
└── server.js           # Server entry point
```

### Available Scripts
```bash
npm start              # Start production server
npm run dev           # Start development server with nodemon
npm run migrate       # Run database migrations
npm run generate      # Generate Prisma client
```

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Company Authorization** - Users can only access their company's data
- **Input Validation** - Joi schema validation on all inputs
- **Error Handling** - Centralized error handling middleware
- **SQL Injection Protection** - Prisma ORM prevents SQL injection

---

## 📝 Important Notes

- All timestamps are in UTC
- UUIDs are used for all primary keys
- All routes require JWT authentication
- Company-specific routes require both authentication and authorization
- Use actual `employee_id` (not `user_id`) when fetching employees by ID
- Phone numbers support international format with optional `+` prefix