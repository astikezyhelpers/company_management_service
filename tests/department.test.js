import request from 'supertest';
import app from '../app.js';

let companyId = 'test-company-id';
let departmentId;

describe('Company Department API Endpoints', () => {
  
  // Create Department
  it("should create a new department", async () => {
    const res = await request(app)
      .post(`/api/company/department/create/${companyId}`)
      .send({
        name: "Engineering",
        code: "ENG01",
        description: "Engineering department",
        cost_center: "CC100",
        budget_allocated: 100000,
        budget_used: 50000,
        manager_id: "manager123",
        level: 1,
        path: "Engineering",
        is_active: true
      });
    
    departmentId = res.body.data._id;
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });

  // Get All Departments
  it("should fetch all departments of a company", async () => {
    const res = await request(app).get(`/api/company/department/get/${companyId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });

  // Get Department by ID
  it("should fetch department by ID", async () => {
    const res = await request(app).get(`/api/company/department/get/${companyId}/${departmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });

  // Update Department
  it("should update department details", async () => {
    const res = await request(app)
      .put(`/api/company/department/update/${companyId}/${departmentId}`)
      .send({
        description: "Updated Engineering department",
        budget_allocated: 120000,
        is_active: false
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });

  // Delete Department
  it("should delete department", async () => {
    const res = await request(app).delete(`/api/company/department/delete/${companyId}/${departmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });

});

describe('Company Department API Negative Test Cases', () => {

  it('should fail when sending empty object for create', async () => {
    const res = await request(app)
      .post(`/api/company/department/create/${companyId}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('details');
    expect(res.body.details).toContain('"name" is required');
    expect(res.body.details).toContain('"code" is required');
  });

  it('should fail when sending invalid field types', async () => {
    const res = await request(app)
      .post(`/api/company/department/create/${companyId}`)
      .send({
        name: "E",
        code: "C",
        budget_allocated: -1000,
        budget_used: -50,
        is_active: "yes"
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.details).toContain('"name" length must be at least 2 characters long');
    expect(res.body.details).toContain('"code" length must be at least 2 characters long');
    expect(res.body.details).toContain('"budget_allocated" must be a positive number');
    expect(res.body.details).toContain('"budget_used" must be greater than or equal to 0');
    expect(res.body.details).toContain('"is_active" must be a boolean');
  });

});
