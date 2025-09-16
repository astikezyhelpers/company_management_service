import request from 'supertest';
import app from '../app.js';

let companyId;


describe('Company API Endpoints',()=>{
    it("should create a new company", async ()=>{
        const res = await request(app).post('/api/company/create').send(
            {
                "name": "Tech Corp",
                "registration_number": "R1",
                "email": "t1@techcrop.com",
                "phone": "1234567990",
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
                    "tax_id": "TAX123456",
                    "billing_address": {
                        "street": "123 Billing St",
                        "city": "San Francisco",
                        "state": "CA",
                        "zip": "94105",
                        "country": "USA"
                    }
                },
                "settings": {
                    "timezone": "PST",
                    "currency": "USD",
                    "notifications": true
                },
                "created_by": "admin-user-id",
                "version": 1
            }
        );
        companyId=res.body.company._id;
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true)
        expect(res.body).toHaveProperty('company');
    })
    // Fetch All Companies

    it("should fetch all companies", async ()=>{
        const res = await request(app).get(`/api/company/get`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true)
        expect(res.body).toHaveProperty('companies');
    })

    // Fetch Company by ID
    it("should fetch company by ID", async ()=>{
        const res = await request(app).get(`/api/company/get/${companyId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true)
        expect(res.body).toHaveProperty('company');
    })

    // Update Company
    it("should update company details", async ()=>{
        const res = await request(app).put(`/api/company/update/${companyId}`).send({
            phone: "0987654321",
            website:"https://new.techcorp.com",
            updated_by: "admin-user-id-2",
            version: 2  
        }); 
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true) 
        expect(res.body).toHaveProperty('company');
    })

    // Delete Company
    it("should delete company", async ()=>{
        const res = await request(app).delete(`/api/company/delete/${companyId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true) 
        expect(res.body).toHaveProperty('company');
    })  
    
    
})


describe('Company API Negative Test Cases', () => {

    it('should fail when sending empty object', async () => {
        const res = await request(app)
            .post('/api/company/create')
            .send({}); 

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('details');
        expect(res.body.details).toContain('"name" is required');
        expect(res.body.details).toContain('"registration_number" is required');
        expect(res.body.details).toContain('"email" is required');
        expect(res.body.details).toContain('"status" is required');
        expect(res.body.details).toContain('"subscription_tier" is required');
    });

    it('should fail when sending invalid email and phone', async () => {
        const res = await request(app)
            .post('/api/company/create')
            .send({
                name: "A",
                registration_number: "REG001",
                email: "invalid-email",
                phone: "1234abc",
                status: "active",
                subscription_tier: "premium"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.details).toContain('"name" length must be at least 2 characters long');
        expect(res.body.details).toContain('"email" must be a valid email');
        expect(res.body.details).toContain('"phone" with value "1234abc" fails to match the required pattern: /^[0-9]{10,15}$/')
    });

    it('should fail when sending invalid status or subscription_tier', async () => {
        const res = await request(app)
            .post('/api/company/create')
            .send({
                name: "Tech Corp",
                registration_number: "REG123",
                email: "test@tech.com",
                status: "unknown_status",
                subscription_tier: "gold"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.details).toContain('"status" must be one of [active, inactive, suspended]');
        expect(res.body.details).toContain('"subscription_tier" must be one of [free, basic, premium, enterprise]');
    });

    it('should fail when sending nested object in wrong format', async () => {
        const res = await request(app)
            .post('/api/company/create')
            .send({
                name: "Tech Corp",
                registration_number: "REG123",
                email: "test@tech.com",
                status: "active",
                subscription_tier: "premium",
                address: "this should be object"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.details).toContain('"address" must be of type object');
    });
});
