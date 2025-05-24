import express from 'express';
import cors from 'cors';
import apiRouter from './src/routes/api'; // 用 import 取代 require

const app = express();
app.use(cors({
    origin: 'https://matt-ai-assistant.vercel.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});