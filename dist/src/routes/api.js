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
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../middleware/auth"); // 假設你有一個 auth.ts 檔案
const passport_1 = __importDefault(require("../middleware/passport")); // 假設你有一個 passport.ts 檔案
const admin_1 = require("../db/admin"); // 假設你有一個 admin.ts 檔案
const jwt_1 = require("../utils/jwt"); // 假設你有一個 jwt.ts 檔案
const accuweather_1 = require("../utils/accuweather"); // 假設你有一個 weather.ts 檔案
dotenv_1.default.config(); // 載入 .env 檔案
const router = express_1.default.Router();
// 建立 MySQL 連線池
router.get('/data', (req, res) => {
    res.json({ message: 'Hello from the API 0524!' });
});
router.get('/users', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //res.json({ message: 'users ok' });
    try {
        //const [rows] = await pool.query('SELECT * FROM admin');
        //const [rows] = await pool.query('SELECT * FROM admin');
        const rows = yield (0, admin_1.getAllAdmins)(); // 使用從 admin.ts 匯入的函式
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
        const rows = yield (0, admin_1.findAdminByAccountAndPassword)(account, password); // 使用從 admin.ts 匯入的函式
        if (rows.length > 0) {
            const user = rows[0];
            /*
            const token = jwt.sign(
                { id: user.id, account: user.account },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '1h' } // 設定 token 的有效期限,超過1小時後就失效並需要重新登入
            );
            */
            const token = (0, jwt_1.generateToken)({ id: user.id, account: user.account }, '1h'); // 使用從 jwt.ts 匯入的函式
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
// OAuth Google 登入
router.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    var _a, _b, _c;
    // 產生 JWT token
    const user = req.user;
    const token = (0, jwt_1.generateToken)({ id: user.id || ((_a = user.profile) === null || _a === void 0 ? void 0 : _a.id), email: (_c = (_b = user.emails) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.value }, '1h');
    // 將 token 存入 session, 用session來管理登入狀態
    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // 僅 HTTPS 時啟用
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000 // 1 小時
    });
    res.redirect(`https://matt-ai-assistant.vercel.app/chatbot`); // 替換為你的前端網址
});
router.post('/weather/utc8', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 預設城市，也可從 req.body.cities 傳入自訂城市
    const cities = req.body.cities || ['Taipei', 'Hong Kong', 'Singapore'];
    try {
        const results = yield Promise.all(cities.map((city) => __awaiter(void 0, void 0, void 0, function* () {
            const key = yield (0, accuweather_1.getLocationKey)(city);
            const weather = yield (0, accuweather_1.getCurrentWeather)(key);
            return { city, weather };
        })));
        //console.log('Weather resultts: ', results);
        res.json(results);
    }
    catch (err) {
        res.status(500).json({ message: 'Weather API error', error: err.message });
    }
}));
exports.default = router;
