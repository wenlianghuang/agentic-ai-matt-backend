"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiRouter = require('./src/routes/api'); // 修正路徑
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', apiRouter); // 確保路由正確掛載
const PORT = process.env.PORT || 3000; // 修正拼寫錯誤
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
