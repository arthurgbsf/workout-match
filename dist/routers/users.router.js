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
const users_service_1 = __importDefault(require("../services/users.service"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const inputValidator_middleware_1 = require("../middlewares/inputValidator.middleware");
const uses_validation_1 = require("../validations/uses.validation");
const router = (0, express_1.Router)();
router.get('/:id?', auth_middleware_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id ? req.params.id : undefined;
        const user = req.query.user ? Boolean(req.query.user) : false;
        const users = yield users_service_1.default.getUser(req.headers['authorization'], user, userId);
        return res.status(200).send(users);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/user', (0, inputValidator_middleware_1.inputValidator)(uses_validation_1.createUserSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield users_service_1.default.create(req.body);
        return res.status(201).send({ message: "User created." });
    }
    catch (error) {
        next(error);
    }
}));
router.put('/user', auth_middleware_1.auth, (0, inputValidator_middleware_1.inputValidator)(uses_validation_1.updateUserSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield users_service_1.default.update(req.body, req.headers['authorization']);
        return res.status(200).send({ message: "User updated." });
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/user', auth_middleware_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield users_service_1.default.remove(req.headers['authorization']);
        req.headers['authorization'] = undefined;
        return res.status(200).send({ message: "The user was deleted." });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
