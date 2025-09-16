import request from 'supertest';
import app from '../app.js';

let companyId = 'test-company-id';
let policyId;

describe('Company Policy API Endpoints', () => {

  // Create Policy
  it("should create a new policy", async () => {
    const res = await request(app)
      .post(`/api/company/policy/create/${companyId}`)
      .send({
        policy_type: "HR",
        name: "Leave Policy",
        description: "Annual leave policy",
        rules: { max_leave: 30 },
        is_active: true,
        priority: 1,
        effective_from: "2025-01-01",
        effective_to: "2025-12-31",
        created_by: "admin",
        version: 1
      });

    policyId = res.body.companyPolicy._id;
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('companyPolicy');
  });

  // Get All Policies
  it("should fetch all policies of a company", async () => {
    const res = await request(app).get(`/api/company/policy/get/${companyId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('companyPolicy');
  });

  // Get Policy by ID
  it("should fetch policy by ID", async () => {
    const res = await request(app).get(`/api/company/policy/get/${companyId}/${policyId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('companyPolicy');
  });

  // Update Policy
  it("should update policy details", async () => {
    const res = await request(app)
      .put(`/api/company/policy/update/${companyId}/${policyId}`)
      .send({
        description: "Updated leave policy",
        priority: 2,
        is_active: false
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('companyPolicy');
  });

  // Delete Policy
  it("should delete policy", async () => {
    const res = await request(app).delete(`/api/company/policy/delete/${companyId}/${policyId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('companyPolicy');
  });

});

describe('Company Policy API Negative Test Cases', () => {

  it('should fail when sending empty object for create', async () => {
    const res = await request(app)
      .post(`/api/company/policy/create/${companyId}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('details');
    expect(res.body.details).toContain('"policy_type" is required');
    expect(res.body.details).toContain('"name" is required');
  });

  it('should fail when sending invalid data types', async () => {
    const res = await request(app)
      .post(`/api/company/policy/create/${companyId}`)
      .send({
        policy_type: "H",
        name: "LP",
        rules: "should be object",
        is_active: "yes",
        priority: -1,
        version: "abc"
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.details).toContain('"name" length must be at least 3 characters long');
    expect(res.body.details).toContain('"rules" must be of type object');
    expect(res.body.details).toContain('"is_active" must be a boolean');
    expect(res.body.details).toContain('"priority" must be a positive number');
    expect(res.body.details).toContain('Version must be a positive integer or a string containing only digits');
  });

});
