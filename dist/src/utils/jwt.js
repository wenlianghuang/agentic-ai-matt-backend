"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
function generateToken(payload, expiresIn = '1h') {
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
}
