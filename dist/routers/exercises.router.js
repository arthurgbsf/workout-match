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
const exercises_service_1 = __importDefault(require("../services/exercises.service"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const exercises_validation_1 = require("../validations/exercises.validation");
const inputValidator_middleware_1 = require("../middlewares/inputValidator.middleware");
const router = (0, express_1.Router)();
router.get('/:id?', auth_middleware_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exerciseId = req.params.id ? req.params.id : undefined;
        const user = req.query.user ? Boolean(req.query.user) : false;
        const exercises = yield exercises_service_1.default.getExercise(req.headers['authorization'], user, exerciseId);
        return res.status(200).send(exercises);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', auth_middleware_1.auth, (0, inputValidator_middleware_1.inputValidator)(exercises_validation_1.createExerciseSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exercises_service_1.default.create(req.body, req.headers['authorization']);
        return res.status(201).send({ message: "Exercise created." });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/:id', auth_middleware_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exercises_service_1.default.copy(req.headers['authorization'], req.params.id);
        return res.status(201).send({ message: "Copied with success." });
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id', auth_middleware_1.auth, (0, inputValidator_middleware_1.inputValidator)(exercises_validation_1.updateExerciseSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exercises_service_1.default.update(req.body, req.headers['authorization'], req.params.id);
        return res.status(200).send({ message: "Exercise updated. " });
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:id', auth_middleware_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exercises_service_1.default.remove(req.headers['authorization'], req.params.id);
        return res.status(200).send({ message: "The exercise was deleted with success." });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
