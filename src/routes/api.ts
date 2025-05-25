import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise'; // 新增
import dotenv from 'dotenv';
const router = express.Router();
dotenv.config(); // 載入 .env 檔案
// 建立 MySQL 連線池
const pool = mysql.createPool({
    host: process.env.DBHOST || 'localhost',
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: 'mattlocaldb',
});

router.get('/data', (req, res) => {
    res.json({ message: 'Hello from the API 0524!' });
});
router.get('/users', async (req:Request,res:Response) => {
    //res.json({ message: 'users ok' });
    
    try {
        //const [rows] = await pool.query('SELECT * FROM admin');
        const [rows] = await pool.query('SELECT * FROM admin');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: (err as Error).message });
    }
        
});
// vercel 是放在雲端伺服器,但mysql 是放在本地端的資料庫
router.post('/login', async (req,res) => {
    const { account, password } = req.body;
    console.log('Received login request:', { account, password });
    if (!account || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM admin WHERE account = ? AND password = ?',
            [account, password]
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

export default router;