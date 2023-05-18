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
const express_1 = require("express");
const inputValidator_middleware_1 = require("../middlewares/inputValidator.middleware");
const uses_validation_1 = require("../validations/uses.validation");
const auths_service_1 = __importDefault(require("../services/auths.service"));
const router = (0, express_1.Router)();
router.post('/login', (0, inputValidator_middleware_1.inputValidator)(uses_validation_1.authUserSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield auths_service_1.default.auth(req.body.email, req.body.password);
        return res.status(200).send({ token });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/forget_password', (0, inputValidator_middleware_1.inputValidator)(uses_validation_1.forgetPwdUserSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield auths_service_1.default.recoveryPassword(req.body);
        return res.status(200).send({ message: 'Email successfully sent.' });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
