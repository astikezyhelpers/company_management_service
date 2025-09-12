import {AppError} from "../utils/Apperror.js";

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(new AppError(400, "Validation Error", error.details.map(d => d.message)));
  }
  next();
};

export default validate;
