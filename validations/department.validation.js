import Joi from "joi";

export const departmentValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().optional(),
  code: Joi.string().min(2).max(20).required(),
  cost_center: Joi.string().optional(),
  budget_allocated: Joi.number().positive().optional(),
  budget_used: Joi.number().min(0).optional(),
  manager_id: Joi.string().optional(),
  parent_id: Joi.string().uuid().optional(),
  level: Joi.number().integer().min(1).optional(),
  path: Joi.string().optional(),
  is_active: Joi.boolean().default(true).optional()
});

export const updateDepartmentSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().optional(),
  code: Joi.string().min(2).max(20).optional(),
  cost_center: Joi.string().optional(),
  budget_allocated: Joi.number().positive().optional(),
  budget_used: Joi.number().min(0).optional(),
  manager_id: Joi.string().optional(),
  parent_id: Joi.string().uuid().optional(),
  level: Joi.number().integer().min(1).optional(),
  path: Joi.string().optional(),
  is_active: Joi.boolean().optional()
});
