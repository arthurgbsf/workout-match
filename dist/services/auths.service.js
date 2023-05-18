"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const users_repository_1 = __importDefault(require("../repositories/users.repository"));
const customError_error_1 = require("../errors/customError.error");
const errorResponses_error_1 = require("../errors/errorResponses.error");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_model_1 = __importDefault(require("../models/mailer.model"));
dotenv_1.default.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";
class AuthsService {
    auth(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.default.getByEmail(email);
            if (user === null) {
                throw new customError_error_1.CustomError(errorResponses_error_1.unauthorized.error0, errorResponses_error_1.unauthorized.code);
            }
            ;
            const result = yield bcrypt_1.default.compare(password, user.password);
            if (result) {
                return jsonwebtoken_1.default.sign({ _id: user._id, email: user.email }, secretJWT, {
                    expiresIn: '1h'
                });
            }
            throw new customError_error_1.CustomError(errorResponses_error_1.unauthorized.error0, errorResponses_error_1.unauthorized.code);
        });
    }
    recoveryPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.email) {
                throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error4, errorResponses_error_1.badRequest.code);
            }
            ;
            const registeredUser = yield users_repository_1.default.getByEmail(user.email);
            if (!registeredUser) {
                throw new customError_error_1.CustomError(errorResponses_error_1.notFound.error0, errorResponses_error_1.notFound.code);
            }
            const { email, _id } = registeredUser;
            if (!_id) {
                throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error4, errorResponses_error_1.badRequest.code);
            }
            const temporaryPassword = crypto_1.default.randomBytes(10).toString('hex');
            const encryptedPassword = yield bcrypt_1.default.hash(temporaryPassword, 10);
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 15);
            mailer_model_1.default.sendMail({
                from: `Workout Match API <${process.env.EMAIL}>`,
                to: email,
                text: 'Email sent by Workout Match API',
                html: `Temporary password to update your forgotten password: ${temporaryPassword}`
            });
            const result = yield users_repository_1.default.update(_id.toString(), { temporaryPassword: encryptedPassword, temporaryPasswordExpiresAt: expirationDate });
            if (result.matchedCount === 0) {
                throw new customError_error_1.CustomError(errorResponses_error_1.notFound.error0, errorResponses_error_1.notFound.code);
            }
            ;
            if (result.modifiedCount === 0) {
                throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error2, errorResponses_error_1.badRequest.code);
            }
            ;
        });
    }
}
exports.default = new AuthsService;
