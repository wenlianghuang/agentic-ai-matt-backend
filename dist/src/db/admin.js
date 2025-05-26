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
exports.getAllAdmins = getAllAdmins;
exports.findAdminByAccountAndPassword = findAdminByAccountAndPassword;
const promise_1 = __importDefault(require("mysql2/promise"));
// 建立 MySQL 連線池
const pool = promise_1.default.createPool({
    host: process.env.DBHOST || 'localhost',
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: 'mattlocaldb',
});
function getAllAdmins() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield pool.query('SELECT * FROM admin');
            return rows;
        }
        catch (err) {
            throw new Error(`Database error: ${err.message}`);
        }
    });
}
function findAdminByAccountAndPassword(account, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield pool.query('SELECT * FROM admin WHERE account = ? AND password = ?', [account, password]);
            return rows.length > 0 ? rows[0] : null;
        }
        catch (err) {
            throw new Error(`Database error: ${err.message}`);
        }
    });
}
