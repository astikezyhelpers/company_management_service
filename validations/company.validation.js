import Joi from "joi";


export const companyValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  registration_number: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  website: Joi.string().uri().optional(),
  industry: Joi.string().optional(),
  address: Joi.object().optional(),
  logo_url: Joi.string().uri().optional(),
  status: Joi.string().valid("active", "inactive", "suspended").required(),
  subscription_tier: Joi.string().valid("free", "basic", "premium", "enterprise").required(),
  billing_info: Joi.object().optional(),
  settings: Joi.object().optional(),
  created_by: Joi.string().optional(),
  updated_by: Joi.string().optional(),
  version:Joi.number().integer().min(1).optional(),
});
export const updateCompanySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  registration_number: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  website: Joi.string().uri().optional(),
  industry: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zip: Joi.string().optional(),
    country: Joi.string().optional()
  }).optional(),
  logo_url: Joi.string().uri().optional(),
  status: Joi.string().valid("active", "inactive", "suspended").optional(),
  subscription_tier: Joi.string().valid("free", "basic", "premium", "enterprise").optional(),
  billing_info: Joi.object({
    tax_id: Joi.string().optional(),
    billing_address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      zip: Joi.string().optional(),
      country: Joi.string().optional()
    }).optional()
  }).optional(),
  settings: Joi.object({
    timezone: Joi.string().optional(),
    currency: Joi.string().optional()
  }).optional(),
  updated_by: Joi.string().optional(),
  version: Joi.number().integer().min(1).optional()
});

