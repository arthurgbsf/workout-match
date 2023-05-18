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
exports.Exercise = exports.exerciseSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
exports.exerciseSchema = new mongoose_1.Schema({
    exercise: {
        type: String,
        required: true
    },
    sets: {
        type: String,
        required: true
    },
    reps: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        required: false,
        get: (createdAt) => (0, moment_1.default)(createdAt).locale('pt-br').format('L [às] LTS ')
    },
    updatedAt: {
        type: String,
        required: false
    },
    copiedExerciseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: false
    },
    inWorkouts: [
        { type: mongoose_1.default.Schema.Types.ObjectId
        }
    ]
}, { toJSON: { getters: true, virtuals: false },
    versionKey: false
});
exports.Exercise = mongoose_1.default.model('Exercise', exports.exerciseSchema);
