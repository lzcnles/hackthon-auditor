const express = require('express');
const axios = require('axios');
const app = express();
const port = 8888;
const dotenv = require('dotenv');
const chat = require('./chat.js');
const multer = require('multer');
const file = require('./file.js');
const audit = require('./audit.js');

// 配置Express中间件，用于解析JSON格式的请求体
app.use(express.json());

// 配置 multer 中间件，存储文件到内存中，也可以存储到磁盘中，根据需求修改
const upload = multer({ storage: multer.memoryStorage() });

// 定义SSE路由，用于调用OpenAI接口并推送结果
app.post('/chat', chat.chat);
app.post('/audit', audit.chat);
// 定义文件上传路由，使用 multer 中间件处理文件
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log('Received file:', req.file);
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const result = await file.uploadFile(req.file.buffer);
        res.json(result);
    } catch (error) {
        console.error('Upload file err:', error);
        res.status(500).send('Upload file failed.');
    }
});


// 设置响应头，用于SSE连接
// const setSSEHeaders = (req, res, next) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     next();
// };
// app.use('/chat', setSSEHeaders);
// app.use('/upload', setSSEHeaders);
// 启动服务器，监听指定端口
app.listen(port, () => {
    console.log(`Start server on: http://0.0.0.0:${port}`);
});