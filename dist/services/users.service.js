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
const users_repository_1 = __importDefault(require("../repositories/users.repository"));
const customError_error_1 = require("../errors/customError.error");
const errorResponses_error_1 = require("../errors/errorResponses.error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const getUserTokenId_util_1 = require("../utils/getUserTokenId.util");
const moment_1 = __importDefault(require("moment"));
const getByIdAndCheck_util_1 = require("../utils/getByIdAndCheck.util");
const objectIdCheck_util_1 = require("../utils/objectIdCheck.util");
dotenv_1.default.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";
class UsersService {
    getUser(headers, user, thirdPartyUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (thirdPartyUserId) {
                (0, objectIdCheck_util_1.objectIdCheck)(thirdPartyUserId);
                const thirdPartyUser = yield (0, getByIdAndCheck_util_1.getByIdAndCheck)(thirdPartyUserId, users_repository_1.default.getById);
                return thirdPartyUser;
            }
            const userId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            const users = yield users_repository_1.default.getAll(userId, user, { myCreatedWorkouts: 1, myCreatedExercises: 1, name: 1, email: 1, _id: 1 });
            if (users.length === 0) {
                throw new customError_error_1.CustomError(errorResponses_error_1.notFound.error1, errorResponses_error_1.notFound.code);
            }
            ;
            return users;
        });
    }
    ;
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = yield users_repository_1.default.getByEmail(user.email);
            if (email) {
                throw new customError_error_1.CustomError(errorResponses_error_1.conflict.error1, errorResponses_error_1.conflict.code);
            }
            if (user.password) {
                user.password = yield bcrypt_1.default.hash(user.password, 10);
            }
            const userWithDate = Object.assign(Object.assign({}, user), { createdAt: new Date() });
            return yield users_repository_1.default.create(userWithDate);
        });
    }
    ;
    update(user, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUserId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            if (user.password) {
                user.password = yield bcrypt_1.default.hash(user.password, 10);
            }
            if (user.email) {
                const email = yield users_repository_1.default.getByEmail(user.email);
                if (email) {
                    throw new customError_error_1.CustomError(errorResponses_error_1.conflict.error1, errorResponses_error_1.conflict.code);
                }
            }
            const userWithUpdatedDate = Object.assign(Object.assign({}, user), { updatedAt: (0, moment_1.default)(new Date()).locale("pt-br").format('L [às] LTS ') });
            const result = yield users_repository_1.default.update(authUserId, userWithUpdatedDate);
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
    ;
    remove(headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUserId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            const result = yield users_repository_1.default.remove(authUserId);
            if (result.deletedCount === 0) {
                throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error3, errorResponses_error_1.badRequest.code);
            }
            ;
        });
    }
    ;
}
;
exports.default = new UsersService;
