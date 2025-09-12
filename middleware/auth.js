import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path: '../.env'});
import prisma from '../db/db.js';
import { AppError } from '../utils/Apperror.js';

// Authentication middleware - verifies JWT token
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new AppError(401, 'Access token required'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(new AppError(403, 'Invalid token'));
        }
        req.user = user;
        next();
    });
};

// Authorization middleware - checks if user has access to specific company
export const authorizeCompanyAccess = async (req, res, next) => {
    try {
        const { companyId } = req.params;
        const userId = req.user.id;

        // Check if user has access to this company
        const employee = await prisma.companyEmployee.findFirst({
            where: {
                company_id: companyId,
                user_id: userId,
                status: 'active'
            }
        });

        if (!employee) {
            return next(new AppError(403, 'Access denied - You do not have access to this company'));
        }

        req.employee = employee;
        next();
    } catch (error) {
        next(error);
    }
};
