import express from 'express';
import cors from 'cors';

const apiRouter = require('./src/routes/api'); // 修正路徑
const app = express();
app.use(cors({
    origin: '*', // 允許所有來源
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允許的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization'] // 允許的標頭
}))
app.use(express.json());
app.use('/api', apiRouter); // 確保路由正確掛載

const PORT = process.env.PORT || 3000; // 修正拼寫錯誤
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});