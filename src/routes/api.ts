import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise'; // 新增
import dotenv from 'dotenv';
import {authenticateToken} from '../middleware/auth'; // 假設你有一個 auth.ts 檔案
import jwt from 'jsonwebtoken'; // 如果你需要使用 JWT 驗證
import passport from '../middleware/passport'; // 假設你有一個 passport.ts 檔案
dotenv.config(); // 載入 .env 檔案
const router = express.Router();

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
router.get('/users',authenticateToken ,async (req:Request,res:Response) => {
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
    if (!account || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM admin WHERE account = ? AND password = ?',
            [account, password]
        );
        if ((rows as any[]).length > 0) {
            const user = (rows as any[])[0];
            const token = jwt.sign(
                { id: user.id, account: user.account },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '1h' } // 設定 token 的有效期限,超過1小時後就失效並需要重新登入
            );
            res.json({ message: 'Login successful!',token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: (err as Error).message });
    }
});
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/*
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // 登入成功，這裡可以產生 JWT 或直接回傳 session
    res.json({ message: 'Google login successful', user: req.user });
  }
);*/
// ...existing code...
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // 產生 JWT token
    const user = req.user as any;
    const token = jwt.sign(
      { id: user.id || user.profile?.id, email: user.emails?.[0]?.value },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );
    // 將 token 存入 session, 用session來管理登入狀態
    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // 僅 HTTPS 時啟用
        sameSite: 'lax',
        maxAge: 60 * 60 * 10 // 1 小時
    });
    res.redirect(`https://matt-ai-assistant.vercel.app/chatbot`); // 替換為你的前端網址
  }
);
// ...existing code...
export default router;