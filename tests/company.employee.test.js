// tests/companyEmployee.test.js
import request from 'supertest';
import app from '../app.js';

let companyId = "company123"; // Replace with actual companyId if needed
let employeeId;

describe('Company Employee API Endpoints', () => {

  // Create Employee
  it('should create a new employee for a company', async () => {
    const res = await request(app)
      .post(`/api/company/employ/create/${companyId}`)
      .send({
        user_id: "user1",
        employee_id: "emp123",
        role: "manager",
        status: "active"
      });

    employeeId = res.body.data.employee_id;

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });

  // Get All Employees
  it('should fetch all employees for a company', async () => {
    const res = await request(app).get(`/api/company/employ/get/${companyId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });

  // Get Employee by ID
  it('should fetch employee by ID', async () => {
    const res = await request(app).get(`/api/company/employ/get/${companyId}/${employeeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });

  // Update Employee
  it('should update employee details', async () => {
    const res = await request(app)
      .put(`/api/company/employ/update/${companyId}/${employeeId}`)
      .send({
        role: "senior-manager",
        status: "active"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });

  // Delete Employee
  it('should delete an employee', async () => {
    const res = await request(app).delete(`/api/company/employ/delete/${companyId}/${employeeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
  });
});

describe('Company Employee API Negative Test Cases', () => {

  it('should fail to create employee with missing required fields', async () => {
    const res = await request(app)
      .post(`/api/company/employ/create/${companyId}`)
      .send({ user_id: "user1" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('message');
  });

  it('should fail to update employee with invalid fields', async () => {
    const res = await request(app)
      .put(`/api/company/employ/update/${companyId}/${employeeId}`)
      .send({ invalidField: "test" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('message');
  });

  it('should fail to fetch non-existent employee', async () => {
    const res = await request(app).get(`/api/company/employ/get/${companyId}/nonexistent`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('message');
  });

});
