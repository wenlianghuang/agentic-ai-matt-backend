"use strict";
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
router.get('/users', (req, res) => {
    res.json({ message: 'users ok' });
    /*
    try {
        //const [rows] = await pool.query('SELECT * FROM admin');
        const [rows] = await pool.query('SELECT * FROM admin');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: (err as Error).message });
    }
        */
});
/*
router.get('/login', async (req: Request, res: Response) => {
    const { username, password } = req.query;
    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM admin WHERE account = ? AND password = ?',
            [username, password]
        );
        if ((rows as any[]).length > 0) {
            res.json({ message: 'Login successful!' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: (err as Error).message });
    }
});
*/
exports.default = router;
