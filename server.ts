import express from 'express';
import cors from 'cors';
const apiRouter = require('./src/routes/api');
const app = express();
app.use(express.json());
const POSRT = process.env.PORT || 3000;
app.listen(POSRT, () => {
    console.log(`Server is running on port ${POSRT}`);
});