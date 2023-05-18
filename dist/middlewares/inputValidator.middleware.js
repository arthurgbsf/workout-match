"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidator = void 0;
const inputValidator = (validation) => {
    return (req, res, next) => {
        try {
            const result = validation.validate(req.body);
            if (result.error) {
                throw new Error(result.error.message);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.inputValidator = inputValidator;
