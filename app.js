import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/company.router.js';
import routerCompanyEmploy from './routes/company.employee.router.js';
import routerCompanyPolicy from './routes/company.policy.router.js';
import routerCompanyDepartment from './routes/company.department.router.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './utils/Apperror.js';
import { metricsMiddleware, metricsHandler } from './middleware/metrics.js';
import { correlationMiddleware } from './middleware/correlation.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use(correlationMiddleware);
app.use(metricsMiddleware);

app.get('/metrics', metricsHandler);

app.use('/api/company', router);
app.use('/api/company/employ', routerCompanyEmploy);
app.use('/api/company/policy', routerCompanyPolicy);
app.use('/api/company/department', routerCompanyDepartment);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;