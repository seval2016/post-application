const { validationResult } = require('express-validator');
const { AppError } = require('../utils/errorHandler');

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const errorMessages = errors.array().map(error => error.msg);
        throw new AppError(errorMessages.join(', '), 400);
    };
};

module.exports = validate; 