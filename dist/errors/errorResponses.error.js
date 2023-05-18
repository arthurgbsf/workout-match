"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conflict = exports.notFound = exports.unauthorized = exports.badRequest = void 0;
exports.badRequest = {
    code: 400,
    error0: "Bad Request.",
    error1: "Invalid Id.",
    error2: "Not Modified.",
    error3: "Not Deleted.",
    error4: "Undefined."
};
exports.unauthorized = {
    code: 401,
    error0: "Unauthorized.",
    error1: "To create a workout is required have exercises.",
    error2: "Is required at least one exercise.",
    error3: "There are no copied exercises in your request body."
};
exports.notFound = {
    code: 404,
    error0: "Not Found.",
    error1: "No registers.",
    error2: "Token not found."
};
exports.conflict = {
    code: 409,
    error0: "Conflict.",
    error1: "Email have already registered."
};
