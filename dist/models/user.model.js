"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
exports.userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    temporaryPassword: {
        type: String,
        required: false,
    },
    temporaryPasswordExpiresAt: {
        type: Date,
        required: false,
    },
    createdAt: {
        required: false,
        type: Date,
        get: (createdAt) => (0, moment_1.default)(createdAt).locale('pt-br').format('L [às] LTS ')
    },
    updatedAt: {
        type: String,
        required: false
    },
    myCreatedWorkouts: [{
            type: mongoose_1.Types.ObjectId,
            ref: 'Workout',
            required: false
        }],
    myCreatedExercises: [{
            type: mongoose_1.Types.ObjectId,
            ref: 'Exercise',
            required: false
        }]
}, { toJSON: { getters: true, virtuals: false },
    versionKey: false
});
exports.User = mongoose_1.default.model('User', exports.userSchema);
