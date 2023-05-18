"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth.router"));
const users_router_1 = __importDefault(require("./users.router"));
const workouts_router_1 = __importDefault(require("./workouts.router"));
const exercises_router_1 = __importDefault(require("./exercises.router"));
const router = (0, express_1.Router)();
router.use('/', auth_router_1.default);
router.use('/users', users_router_1.default);
router.use('/training-data/workouts', workouts_router_1.default);
router.use('/training-data/exercises', exercises_router_1.default);
exports.default = router;
