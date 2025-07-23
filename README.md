# Company Management Service - Low Level Design (LLD)

## 1. Service Overview

**Service Name**: Company Management Service  
**Port**: 3002  
**Database**: PostgreSQL  
**Architecture Pattern**: Microservice with Domain-Driven Design  
**Communication**: REST API + Event-Driven Messaging  

### 1.1 Service Responsibilities
- Company registration and onboarding
- Company profile management
- Team/department structure management
- Company travel policies configuration
- Employee-company relationship management

## 2. Detailed Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        COMPANY MANAGEMENT SERVICE                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   API Layer     │    │  Business Logic │    │   Data Layer    │            │
│  │                 │    │     Layer       │    │                 │            │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │            │
│  │ │   Company   │ │    │ │   Company   │ │    │ │  Company    │ │            │
│  │ │ Controller  │◄┼────┼►│   Service   │◄┼────┼►│ Repository  │ │            │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │            │
│  │                 │    │                 │    │                 │            │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │            │
│  │ │  Employee   │ │    │ │  Employee   │ │    │ │  Employee   │ │            │
│  │ │ Controller  │◄┼────┼►│   Service   │◄┼────┼►│ Repository  │ │            │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │            │
│  │                 │    │                 │    │                 │            │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │            │
│  │ │   Policy    │ │    │ │   Policy    │ │    │ │   Policy    │ │            │
│  │ │ Controller  │◄┼────┼►│   Service   │◄┼────┼►│ Repository  │ │            │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │            │
│  │                 │    │                 │    │                 │            │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │            │
│  │ │ Department  │ │    │ │ Department  │ │    │ │ Department  │ │            │
│  │ │ Controller  │◄┼────┼►│   Service   │◄┼────┼►│ Repository  │ │            │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│           │                       │                       │                   │
│           ▼                       ▼                       ▼                   │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Middleware    │    │   Event Bus     │    │   Database      │            │
│  │   Layer         │    │   Publisher     │    │   Connection    │            │
│  │                 │    │                 │    │   Pool          │            │
│  │ • Authentication│    │ • Domain Events │    │                 │            │
│  │ • Authorization │    │ • Integration   │    │ • PostgreSQL    │            │
│  │ • Validation    │    │   Events        │    │ • Connection    │            │
│  │ • Error Handler │    │ • Event Store   │    │   Management    │            │
│  │ • Rate Limiting │    │                 │    │ • Transaction   │            │
│  │ • Logging       │    │                 │    │   Management    │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                   │                                           │
└───────────────────────────────────┼───────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            EXTERNAL INTEGRATIONS                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │ User Management │    │   Message       │    │   Notification  │            │
│  │    Service      │    │   Queue         │    │    Service      │            │
│  │                 │    │  (RabbitMQ)     │    │                 │            │
│  │ • User Creation │    │                 │    │ • Email Alerts  │            │
│  │ • Role Updates  │    │ • Event Pub/Sub │    │ • Welcome Msgs  │            │
│  │ • Profile Sync  │    │ • Async Comm    │    │ • Status Updates│            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Wallet        │    │    Expense      │    │   File Storage  │            │
│  │   Service       │    │   Service       │    │   Service       │            │
│  │                 │    │                 │    │                 │            │
│  │ • Budget Setup  │    │ • Policy Sync   │    │ • Document      │            │
│  │ • Limit Config  │    │ • Limit Updates │    │   Upload        │            │
│  │ • Allocation    │    │ • Category Sync │    │ • Logo Storage  │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 3. Component Design Details

### 3.1 API Layer Components

#### Company Controller
```
┌─────────────────────────────────────────────┐
│           Company Controller                │
├─────────────────────────────────────────────┤
│                                             │
│  HTTP Endpoints:                            │
│  • POST   /companies                        │
│  • GET    /companies/{id}                   │
│  • PUT    /companies/{id}                   │
│  • DELETE /companies/{id}                   │
│  • GET    /companies/{id}/profile           │
│  • PUT    /companies/{id}/profile           │
│  • GET    /companies/search                 │
│                                             │
│  Responsibilities:                          │
│  • Request validation                       │
│  • Response formatting                      │
│  • Error handling                           │
│  • Authentication checks                    │
│  • Rate limiting                            │
│                                             │
└─────────────────────────────────────────────┘
```

#### Employee Controller
```
┌─────────────────────────────────────────────┐
│           Employee Controller               │
├─────────────────────────────────────────────┤
│                                             │
│  HTTP Endpoints:                            │
│  • POST   /companies/{id}/employees         │
│  • GET    /companies/{id}/employees         │
│  • GET    /companies/{id}/employees/{empId} │
│  • PUT    /companies/{id}/employees/{empId} │
│  • DELETE /companies/{id}/employees/{empId} │
│  • POST   /companies/{id}/employees/bulk    │
│  • GET    /companies/{id}/employees/export  │
│                                             │
│  Responsibilities:                          │
│  • Employee onboarding                      │
│  • Team member management                   │
│  • Bulk operations                          │
│  • Data export/import                       │
│                                             │
└─────────────────────────────────────────────┘
```

#### Policy Controller
```
┌─────────────────────────────────────────────┐
│            Policy Controller                │
├─────────────────────────────────────────────┤
│                                             │
│  HTTP Endpoints:                            │
│  • POST   /companies/{id}/policies          │
│  • GET    /companies/{id}/policies          │
│  • GET    /companies/{id}/policies/{pId}    │
│  • PUT    /companies/{id}/policies/{pId}    │
│  • DELETE /companies/{id}/policies/{pId}    │
│  • POST   /companies/{id}/policies/validate │
│                                             │
│  Policy Types:                              │
│  • Travel policies                          │
│  • Expense policies                         │
│  • Approval workflows                       │
│  • Budget constraints                       │
│                                             │
└─────────────────────────────────────────────┘
```

#### Department Controller
```
┌─────────────────────────────────────────────┐
│          Department Controller              │
├─────────────────────────────────────────────┤
│                                             │
│  HTTP Endpoints:                            │
│  • POST   /companies/{id}/departments       │
│  • GET    /companies/{id}/departments       │
│  • GET    /companies/{id}/departments/{dId} │
│  • PUT    /companies/{id}/departments/{dId} │
│  • DELETE /companies/{id}/departments/{dId} │
│  • GET    /companies/{id}/org-chart         │
│                                             │
│  Features:                                  │
│  • Hierarchical structure                   │
│  • Department budgets                       │
│  • Manager assignments                      │
│  • Employee transfers                       │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.2 Business Logic Layer

#### Company Service Domain Model
```
┌─────────────────────────────────────────────────────────────────────┐
│                        Company Service                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Core Business Operations:                                          │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Company Registration & Onboarding                           │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│  │
│  │  │  1. Validate    │  │  2. Create      │  │  3. Initialize  ││  │
│  │  │     Company     │─▶│     Company     │─▶│     Defaults    ││  │
│  │  │     Details     │  │     Record      │  │                 ││  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘│  │
│  │                                │                              │  │
│  │                                ▼                              │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│  │
│  │  │  4. Create      │  │  5. Setup       │  │  6. Publish     ││  │
│  │  │     Admin       │─▶│     Initial     │─▶│     Events      ││  │
│  │  │     User        │  │     Policies    │  │                 ││  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘│  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Profile Management                                           │  │
│  │  • Company information updates                               │  │
│  │  • Logo and branding management                              │  │
│  │  • Contact information                                       │  │
│  │  • Subscription and billing details                         │  │
│  │  • Compliance and regulatory info                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Business Rules & Validation                                 │  │
│  │  • Unique company registration number                        │  │
│  │  • Valid business email domain                               │  │
│  │  • Subscription tier limits                                  │  │
│  │  • Regulatory compliance checks                              │  │
│  │  • Data retention policies                                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Employee Service Domain Model
```
┌─────────────────────────────────────────────────────────────────────┐
│                       Employee Service                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Employee Lifecycle Management:                                     │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Employee Onboarding Workflow                                 │  │
│  │                                                               │  │
│  │  Manager Initiates  ┌─────────────────┐  System Creates      │  │
│  │  Onboarding       ─▶│  Validate       │─▶ User Account       │  │
│  │                     │  Employee Data  │                      │  │
│  │                     └─────────────────┘                      │  │
│  │                              │                               │  │
│  │                              ▼                               │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│  │
│  │  │  Assign         │  │  Create         │  │  Send Welcome   ││  │
│  │  │  Department     │─▶│  Wallet &       │─▶│  Notification   ││  │
│  │  │  & Role         │  │  Budget         │  │                 ││  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘│  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Employee Operations                                          │  │
│  │  • Profile management                                        │  │
│  │  • Department transfers                                      │  │
│  │  • Role and permission updates                               │  │
│  │  • Status management (active/inactive)                       │  │
│  │  • Bulk operations (import/export)                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Validation Rules                                            │  │
│  │  • Unique employee ID within company                         │  │
│  │  • Valid email format                                        │  │
│  │  • Department must exist                                     │  │
│  │  • Manager authorization required                            │  │
│  │  • Company employee limit check                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Data Layer Design

#### Database Schema Diagram
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            PostgreSQL Database Schema                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                            COMPANIES                                    │   │
│  │─────────────────────────────────────────────────────────────────────────│   │
│  │  id (UUID, PK)                    │  created_at (TIMESTAMP)             │   │
│  │  name (VARCHAR)                   │  updated_at (TIMESTAMP)             │   │
│  │  registration_number (VARCHAR)    │  created_by (UUID, FK)              │   │
│  │  email (VARCHAR)                  │  updated_by (UUID, FK)              │   │
│  │  phone (VARCHAR)                  │  version (INTEGER)                  │   │
│  │  website (VARCHAR)                │  status (ENUM)                      │   │
│  │  industry (VARCHAR)               │  subscription_tier (ENUM)           │   │
│  │  address (JSONB)                  │  billing_info (JSONB)               │   │
│  │  logo_url (VARCHAR)               │  settings (JSONB)                   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                        │                                       │
│                                        │ 1:N                                   │
│                                        ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           DEPARTMENTS                                   │   │
│  │─────────────────────────────────────────────────────────────────────────│   │
│  │  id (UUID, PK)                    │  budget_allocated (DECIMAL)         │   │
│  │  company_id (UUID, FK)            │  budget_used (DECIMAL)              │   │
│  │  name (VARCHAR)                   │  manager_id (UUID, FK)              │   │
│  │  description (TEXT)               │  parent_id (UUID, FK)               │   │
│  │  code (VARCHAR)                   │  level (INTEGER)                    │   │
│  │  cost_center (VARCHAR)            │  path (LTREE)                       │   │
│  │  created_at (TIMESTAMP)           │  is_active (BOOLEAN)                │   │
│  │  updated_at (TIMESTAMP)           │                                     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                        │                                       │
│                                        │ 1:N                                   │
│                                        ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      COMPANY_EMPLOYEES                                  │   │
│  │─────────────────────────────────────────────────────────────────────────│   │
│  │  id (UUID, PK)                    │  start_date (DATE)                  │   │
│  │  company_id (UUID, FK)            │  end_date (DATE)                    │   │
│  │  user_id (UUID, FK)               │  salary_band (VARCHAR)              │   │
│  │  employee_id (VARCHAR)            │  reporting_manager_id (UUID, FK)    │   │
│  │  department_id (UUID, FK)         │  employment_type (ENUM)             │   │
│  │  designation (VARCHAR)            │  status (ENUM)                      │   │
│  │  role (ENUM)                      │  created_at (TIMESTAMP)             │   │
│  │  budget_limit (DECIMAL)           │  updated_at (TIMESTAMP)             │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        COMPANY_POLICIES                                 │   │
│  │─────────────────────────────────────────────────────────────────────────│   │
│  │  id (UUID, PK)                    │  effective_from (DATE)              │   │
│  │  company_id (UUID, FK)            │  effective_to (DATE)                │   │
│  │  policy_type (ENUM)               │  created_by (UUID, FK)              │   │
│  │  name (VARCHAR)                   │  approved_by (UUID, FK)             │   │
│  │  description (TEXT)               │  approval_date (TIMESTAMP)          │   │
│  │  rules (JSONB)                    │  version (INTEGER)                  │   │
│  │  is_active (BOOLEAN)              │  created_at (TIMESTAMP)             │   │
│  │  priority (INTEGER)               │  updated_at (TIMESTAMP)             │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      COMPANY_SETTINGS                                   │   │
│  │─────────────────────────────────────────────────────────────────────────│   │
│  │  id (UUID, PK)                    │  value (JSONB)                      │   │
│  │  company_id (UUID, FK)            │  data_type (ENUM)                   │   │
│  │  category (VARCHAR)               │  is_encrypted (BOOLEAN)             │   │
│  │  key (VARCHAR)                    │  created_at (TIMESTAMP)             │   │
│  │  description (TEXT)               │  updated_at (TIMESTAMP)             │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Database Indexes and Constraints
```
┌─────────────────────────────────────────────────────────────────────┐
│                         Database Indexes                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PRIMARY INDEXES:                                                   │
│  • companies_pkey (id)                                              │
│  • departments_pkey (id)                                            │
│  • company_employees_pkey (id)                                      │
│  • company_policies_pkey (id)                                       │
│  • company_settings_pkey (id)                                       │
│                                                                     │
│  UNIQUE INDEXES:                                                    │
│  • companies_registration_number_unique                             │
│  • companies_email_unique                                           │
│  • company_employees_company_employee_id_unique                     │
│  • departments_company_code_unique                                  │
│  • company_settings_company_category_key_unique                     │
│                                                                     │
│  FOREIGN KEY INDEXES:                                               │
│  • departments_company_id_idx                                       │
│  • departments_manager_id_idx                                       │
│  • departments_parent_id_idx                                        │
│  • company_employees_company_id_idx                                 │
│  • company_employees_user_id_idx                                    │
│  • company_employees_department_id_idx                              │
│  • company_policies_company_id_idx                                  │
│  • company_settings_company_id_idx                                  │
│                                                                     │
│  SEARCH INDEXES:                                                    │
│  • companies_name_gin_idx (GIN for full-text search)               │
│  • departments_path_gist_idx (GiST for hierarchical queries)       │
│  • company_policies_rules_gin_idx (GIN for JSONB queries)          │
│                                                                     │
│  PARTIAL INDEXES:                                                   │
│  • companies_active_idx (WHERE status = 'ACTIVE')                  │
│  • departments_active_idx (WHERE is_active = true)                 │
│  • company_employees_active_idx (WHERE status = 'ACTIVE')          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 4. Event-Driven Architecture

### 4.1 Domain Events
```
┌─────────────────────────────────────────────────────────────────────┐
│                          Domain Events                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Company Events:                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  • CompanyRegistered                                        │   │
│  │    - companyId, name, adminEmail, registrationNumber       │   │
│  │                                                             │   │
│  │  • CompanyProfileUpdated                                    │   │
│  │    - companyId, updatedFields, updatedBy, timestamp        │   │
│  │                                                             │   │
│  │  • CompanyStatusChanged                                     │   │
│  │    - companyId, oldStatus, newStatus, reason               │   │
│  │                                                             │   │
│  │  • CompanySubscriptionUpdated                               │   │
│  │    - companyId, oldTier, newTier, effectiveDate            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Employee Events:                                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  • EmployeeOnboarded                                        │   │
│  │    - companyId, employeeId, userId, departmentId, role     │   │
│  │                                                             │   │
│  │  • EmployeeTransferred                                      │   │
│  │    - employeeId, oldDepartment, newDepartment, effectiveDate│   │
│  │                                                             │   │
│  │  • EmployeeRoleChanged                                      │   │
│  │    - employeeId, oldRole, newRole, permissions             │   │
│  │                                                             │   │
│  │  • EmployeeDeactivated                                      │   │
│  │    - employeeId, reason, deactivatedBy, effectiveDate      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Policy Events:                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  • PolicyCreated                                            │   │
│  │    - policyId, companyId, policyType, rules, createdBy     │   │
│  │                                                             │   │
│  │  • PolicyUpdated                                            │   │
│  │    - policyId, changedRules, version, approvedBy           │   │
│  │                                                             │   │
│  │  • PolicyActivated/Deactivated                             │   │
│  │    - policyId, status, effectiveDate, reason               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Department Events:                                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  • DepartmentCreated                                        │   │
│  │    - departmentId, companyId, name, managerId, parentId    │   │
│  │                                                             │   │
│  │  • DepartmentRestructured                                   │   │
│  │    - departmentId, oldStructure, newStructure              │   │
│  │                                                             │   │
│  │  • DepartmentBudgetUpdated                                  │   │
│  │    - departmentId, oldBudget, newBudget, reason            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Event Flow Diagram
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Event Flow Architecture                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Company Management Service                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                                                                         │   │
│  │  Domain Event ──▶ Event Publisher ──▶ Message Queue (RabbitMQ)         │   │
│  │                                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                        │                                       │
│                                        │ Publishes Events
│                                        ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          Event Consumers                                │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │ User Management │  │ Wallet Service  │  │ Notification    │        │   │
│  │  │ Service         │  │                 │  │ Service         │        │   │
│  │  │                 │  │ • Budget Setup  │  │                 │        │   │
│  │  │ • User Creation │  │ • Limit Config  │  │ • Welcome Email │        │   │
│  │  │ • Role Updates  │  │ • Department    │  │ • Status Alerts │        │   │
│  │  │ • Profile Sync  │  │   Budgets       │  │ • Policy Update │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │ Expense Service │  │ Analytics       │  │ Audit Service   │        │   │
│  │  │                 │  │ Service         │  │                 │        │   │
│  │  │ • Policy Sync   │  │                 │  │ • Event Log     │        │   │
│  │  │ • Limit Updates │  │ • Usage Reports │  │ • Compliance    │        │   │
│  │  │ • Category Sync │  │ • Trend Analysis│  │ • Change Track  │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 5. Detailed Design Diagrams & Workflows

### 5.1 Company Registration Flow Diagram
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Company Registration Workflow                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Admin User Input                                                               │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Validation    │    │    Company      │    │   Admin User    │            │
│  │   Gateway       │───▶│   Creation      │───▶│   Setup         │            │
│  │                 │    │                 │    │                 │            │
│  │ • Data Format   │    │ • Unique Reg#   │    │ • User Account  │            │
│  │ • Required      │    │ • Email Domain  │    │ • Temp Password │            │
│  │   Fields        │    │ • Status Set    │    │ • Role Assign   │            │
│  │ • Business      │    │ • Subscription  │    │                 │            │
│  │   Rules         │    │   Tier          │    │                 │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│           │                       │                       │                   │
│           │ Success               │ Success               │ Success           │
│           ▼                       ▼                       ▼                   │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Default       │    │   Event         │    │   Notification  │            │
│  │   Setup         │    │   Publishing    │    │   Dispatch      │            │
│  │                 │    │                 │    │                 │            │
│  │ • Department    │    │ • Company       │    │ • Welcome Email │            │
│  │   Creation      │    │   Registered    │    │ • Admin Alert   │            │
│  │ • Policy        │    │ • User Created  │    │ • System Log    │            │
│  │   Templates     │    │ • Dept Created  │    │                 │            │
│  │ • Settings      │    │                 │    │                 │            │
│  │   Config        │    │                 │    │                 │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                   │                                           │
│                                   ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                    External Service Integration                         │  │
│  │                                                                         │  │
│  │  User Management  │  Wallet Service  │  Notification  │  Analytics      │  │
│  │  Service          │                  │  Service       │  Service        │  │
│  │                   │  • Budget Init   │                │                 │  │
│  │  • User Creation  │  • Wallet Create │  • Email Queue │  • Company      │  │
│  │  • Permission     │  • Limit Setup   │  • SMS Queue   │   Metrics       │  │
│  │    Setup          │                  │                │                 │  │
│  └─────────────────────────────────────────────────────────────────────────┐  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Employee Onboarding Flow Diagram
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Employee Onboarding Workflow                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Manager Initiates                                                              │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Manager       │    │   Employee      │    │   Department    │            │
│  │   Validation    │───▶│   Data          │───▶│   Assignment    │            │
│  │                 │    │   Validation    │    │                 │            │
│  │ • Manager Auth  │    │                 │    │ • Dept Exists   │            │
│  │ • Permission    │    │ • Unique Emp ID │    │ • Manager Auth  │            │
│  │   Check         │    │ • Email Format  │    │ • Capacity      │            │
│  │ • Company       │    │ • Phone Valid   │    │   Check         │            │
│  │   Limits        │    │ • Required      │    │                 │            │
│  │                 │    │   Fields        │    │                 │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│           │                       │                       │                   │
│           │ Authorized            │ Valid                 │ Assigned          │
│           ▼                       ▼                       ▼                   │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   User Account  │    │   Employee      │    │   Budget &      │            │
│  │   Creation      │    │   Record        │    │   Wallet        │            │
│  │                 │    │   Creation      │    │   Setup         │            │
│  │ • User Profile  │    │                 │    │                 │            │
│  │ • Credentials   │    │ • Employee ID   │    │ • Budget Limit  │            │
│  │ • Role Setup    │    │ • Department    │    │ • Wallet Create │            │
│  │ • Permission    │    │   Link          │    │ • Policy Apply  │            │
│  │   Matrix        │    │ • Manager Link  │    │                 │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│           │                       │                       │                   │
│           │ Created               │ Created               │ Setup Complete    │
│           ▼                       ▼                       ▼                   │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Welcome       │    │   Event         │    │   Integration   │            │
│  │   Package       │    │   Broadcasting  │    │   Sync          │            │
│  │                 │    │                 │    │                 │            │
│  │ • Welcome Email │    │ • Employee      │    │ • External      │            │
│  │ • Login         │    │   Onboarded     │    │   Systems       │            │
│  │   Credentials   │    │ • User Created  │    │ • Directory     │            │
│  │ • Quick Start   │    │ • Wallet Init   │    │   Sync          │            │
│  │   Guide         │    │ • Budget Set    │    │ • Tool Access   │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Department Hierarchy Management Diagram
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      Department Hierarchy Management                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Hierarchical Structure Representation:                                        │
│                                                                                 │
│                        ┌─────────────────┐                                     │
│                        │   CEO Office    │                                     │
│                        │   (Level 0)     │                                     │
│                        │   ID: 001       │                                     │
│                        │   Budget: 100K  │                                     │
│                        └─────────────────┘                                     │
│                               │                                                 │
│              ┌────────────────┼────────────────┐                               │
│              │                │                │                               │
│              ▼                ▼                ▼                               │
│    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                │
│    │   Engineering   │ │     Sales       │ │      HR         │                │
│    │   (Level 1)     │ │   (Level 1)     │ │   (Level 1)     │                │
│    │   ID: 002       │ │   ID: 003       │ │   ID: 004       │                │
│    │   Budget: 40K   │ │   Budget: 35K   │ │   Budget: 25K   │                │
│    └─────────────────┘ └─────────────────┘ └─────────────────┘                │
│            │                    │                    │                         │
│    ┌───────┼───────┐            │            ┌───────┼───────┐                │
│    │       │       │            │            │       │       │                │
│    ▼       ▼       ▼            ▼            ▼       ▼       ▼                │
│ ┌─────┐ ┌─────┐ ┌─────┐   ┌─────────┐   ┌─────┐ ┌─────┐ ┌─────┐               │
│ │Dev  │ │QA   │ │Ops  │   │Regional │   │Rec  │ │Comp │ │L&D  │               │
│ │Team │ │Team │ │Team │   │Sales    │   │Team │ │Team │ │Team │               │
│ │(L2) │ │(L2) │ │(L2) │   │(Level2) │   │(L2) │ │(L2) │ │(L2) │               │
│ └─────┘ └─────┘ └─────┘   └─────────┘   └─────┘ └─────┘ └─────┘               │
│                                                                                 │
│  Management Operations:                                                         │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      Department Operations                              │   │
│  │                                                                         │   │
│  │  Create Department:                                                     │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │   Validate      │─▶│   Hierarchy     │─▶│   Budget        │        │   │
│  │  │   Parameters    │  │   Validation    │  │   Allocation    │        │   │
│  │  │                 │  │                 │  │                 │        │   │
│  │  │ • Parent Exists │  │ • Level Limits  │  │ • Parent Budget │        │   │
│  │  │ • Name Unique   │  │ • Depth Check   │  │ • Allocation    │        │   │
│  │  │ • Manager Auth  │  │ • Circular Ref  │  │   Validation    │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  │                                                                         │   │
│  │  Restructure Department:                                                │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │   Employee      │─▶│   Budget        │─▶│   Notification  │        │   │
│  │  │   Transfer      │  │   Reallocation  │  │   & Updates     │        │   │
│  │  │                 │  │                 │  │                 │        │   │
│  │  │ • Employee List │  │ • Calculate     │  │ • Employee      │        │   │
│  │  │ • New Manager   │  │   New Budgets   │  │   Notification  │        │   │
│  │  │ • Role Updates  │  │ • Update Limits │  │ • System Update │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Policy Management System Diagram
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          Policy Management System                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Policy Types & Hierarchy:                                                     │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Travel Policies                                  │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │   Flight        │  │     Hotel       │  │   Transportation│        │   │
│  │  │   Policy        │  │    Policy       │  │     Policy      │        │   │
│  │  │                 │  │                 │  │                 │        │   │
│  │  │ • Class Limits  │  │ • Star Rating   │  │ • Pickup Rules  │        │   │
│  │  │ • Advance Book  │  │ • Location      │  │ • Expense Limit │        │   │
│  │  │ • Price Caps    │  │   Restrictions  │  │ • Approval Req  │        │   │
│  │  │ • Approval      │  │ • Duration      │  │                 │        │   │
│  │  │   Thresholds    │  │   Limits        │  │                 │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                       Expense Policies                                  │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │   Category      │  │    Receipt      │  │   Approval      │        │   │
│  │  │   Limits        │  │   Requirements  │  │   Workflow      │        │   │
│  │  │                 │  │                 │  │                 │        │   │
│  │  │ • Food & Dining │  │ • Mandatory     │  │ • Amount        │        │   │
│  │  │ • Transportation│  │   Categories    │  │   Thresholds    │        │   │
│  │  │ • Accommodation │  │ • Digital       │  │ • Approver      │        │   │
│  │  │ • Miscellaneous │  │   Format        │  │   Hierarchy     │        │   │
│  │  │                 │  │ • OCR Validation│  │ • Time Limits   │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Policy Lifecycle Management:                                                  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Policy Creation & Approval                           │   │
│  │                                                                         │   │
│  │  Draft Creation ──▶ Validation ──▶ Review ──▶ Approval ──▶ Activation  │   │
│  │       │                │              │          │           │         │   │
│  │       ▼                ▼              ▼          ▼           ▼         │   │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────┐ ┌─────────┐ ┌─────────┐    │   │
│  │  │Template │    │Business │    │Stakeholder│Multi-Level│ Version │    │   │
│  │  │Selection│    │Rule     │    │Review   │ │Approval │ │Control  │    │   │
│  │  │         │    │Check    │    │         │ │         │ │         │    │   │
│  │  │• Pre-   │    │         │    │• Legal  │ │• Manager│ │• Deploy │    │   │
│  │  │  defined│    │• Logic  │    │• Compliance│• Admin │ │• Notify │    │   │
│  │  │• Custom │    │• Conflicts│  │• Finance│ │• C-Level│ │• Audit  │    │   │
│  │  │• Import │    │• Dependencies││         │ │         │ │         │    │   │
│  │  └─────────┘    └─────────┘    └─────────┘ └─────────┘ └─────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  Policy Enforcement Architecture:                                              │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      Policy Engine                                      │   │
│  │                                                                         │   │
│  │  Booking Request ──▶ Policy Evaluation ──▶ Decision Engine ──▶ Action  │   │
│  │        │                     │                    │              │     │   │
│  │        ▼                     ▼                    ▼              ▼     │   │
│  │  ┌─────────┐         ┌─────────────┐      ┌─────────────┐ ┌─────────┐  │   │
│  │  │Request  │         │Rule Matcher │      │Decision     │ │Response │  │   │
│  │  │Context  │         │             │      │Tree         │ │Handler  │  │   │
│  │  │         │         │• Amount     │      │             │ │         │  │   │
│  │  │• User   │         │  Validation │      │• Allow      │ │• Approve│  │   │
│  │  │• Amount │         │• Category   │      │• Deny       │ │• Reject │  │   │
│  │  │• Category│        │  Check      │      │• Escalate   │ │• Route  │  │   │
│  │  │• Date   │         │• Time Rules │      │• Warn       │ │         │  │   │
│  │  │• Department│      │• Hierarchy  │      │             │ │         │  │   │
│  │  └─────────┘         └─────────────┘      └─────────────┘ └─────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘