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
const express_1 = __importDefault(require("express"));
const promise_1 = __importDefault(require("mysql2/promise")); // 新增
const router = express_1.default.Router();
// 建立 MySQL 連線池
const pool = promise_1.default.createPool({
    host: 'localhost',
    user: 'root',
    password: 'wenliang75',
    database: 'mattlocaldb',
});
router.get('/data', (req, res) => {
    res.json({ message: 'Hello from the API 0524!' });
});
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //res.json({ message: 'users ok' });
    try {
        //const [rows] = await pool.query('SELECT * FROM admin');
        const [rows] = yield pool.query('SELECT * FROM admin');
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ message: 'Database error', error: err.message });
    }
}));
// vercel 是放在雲端伺服器,但mysql 是放在本地端的資料庫
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { account, password } = req.body;
    console.log('Received login request:', { account, password });
    if (!account || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }
    try {
        const [rows] = yield pool.query('SELECT * FROM admin WHERE account = ? AND password = ?', [account, password]);
        if (rows.length > 0) {
            res.json({ message: 'Login successful!' });
        }
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Database error', error: err.message });
    }
}));
exports.default = router;
