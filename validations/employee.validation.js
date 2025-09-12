import Joi from "joi";

export const employeeValidation = Joi.object({
  user_id: Joi.string().required(),
  employee_id: Joi.string().required(),
  department_id: Joi.string().uuid().optional(),
  designation: Joi.string().optional(),
  role: Joi.string().required(),
  budget_limit: Joi.number().positive().optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
  salary_band: Joi.string().optional(),
  reporting_manager_id: Joi.string().optional(),
  employment_type: Joi.string().valid("full-time", "part-time", "contract", "intern", "temporary").optional(),
  status: Joi.string().valid("active", "inactive", "terminated", "on-leave").required()
});

export const updateEmployeeSchema = Joi.object({
  user_id: Joi.string().optional(),
  designation: Joi.string().optional(),
  role: Joi.string().optional(),
  budget_limit: Joi.number().positive().optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
  salary_band: Joi.string().optional(),
  reporting_manager_id: Joi.string().optional(),
  employment_type: Joi.string().valid("full-time", "part-time", "contract", "intern", "temporary").optional(),
  status: Joi.string().valid("active", "inactive", "terminated", "on-leave").optional(),
  department_id: Joi.string().uuid().optional()
});
