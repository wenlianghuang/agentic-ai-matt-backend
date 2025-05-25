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
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../middleware/auth"); // 假設你有一個 auth.ts 檔案
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // 如果你需要使用 JWT 驗證
const passport_1 = __importDefault(require("../middleware/passport")); // 假設你有一個 passport.ts 檔案
dotenv_1.default.config(); // 載入 .env 檔案
const router = express_1.default.Router();
// 建立 MySQL 連線池
const pool = promise_1.default.createPool({
    host: process.env.DBHOST || 'localhost',
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: 'mattlocaldb',
});
router.get('/data', (req, res) => {
    res.json({ message: 'Hello from the API 0524!' });
});
router.get('/users', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (!account || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }
    try {
        const [rows] = yield pool.query('SELECT * FROM admin WHERE account = ? AND password = ?', [account, password]);
        if (rows.length > 0) {
            const user = rows[0];
            const token = jsonwebtoken_1.default.sign({ id: user.id, account: user.account }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' } // 設定 token 的有效期限,超過1小時後就失效並需要重新登入
            );
            res.json({ message: 'Login successful!', token });
        }
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Database error', error: err.message });
    }
}));
router.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
/*
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // 登入成功，這裡可以產生 JWT 或直接回傳 session
    res.json({ message: 'Google login successful', user: req.user });
  }
);*/
// ...existing code...
router.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    var _a, _b, _c;
    // 產生 JWT token
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({ id: user.id || ((_a = user.profile) === null || _a === void 0 ? void 0 : _a.id), email: (_c = (_b = user.emails) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.value }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // 僅 HTTPS 時啟用
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000 // 1 小時
    });
    // 導向前端，並帶上 token
    //res.redirect(`https://matt-ai-assistant.vercel.app/oauth-success?token=${token}`);
    res.redirect(`https://matt-ai-assistant.vercel.app/chatbot`); // 替換為你的前端網址
});
// ...existing code...
exports.default = router;
