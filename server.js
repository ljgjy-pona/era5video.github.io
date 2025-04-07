const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();

// 启用 CORS
app.use(cors());

// 认证配置
const auth = new google.auth.GoogleAuth({
  keyFile: './service-account-credentials.json',
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

// 初始化 Google Drive API 客户端
const drive = google.drive({ version: 'v3', auth });

// 代理端点：获取文件流
app.get('/api/file', async (req, res) => {
  const fileId = req.query.id;
  if (!fileId) return res.status(400).send('缺少文件ID');

  try {
    // 获取文件元数据（验证权限）
    const { data: fileMeta } = await drive.files.get({ fileId, fields: 'name,mimeType' });

    // 获取文件流
    const fileStream = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    // 设置响应头
    res.setHeader('Content-Type', fileMeta.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${fileMeta.name}"`);

    // 流式传输
    fileStream.data.pipe(res);

  } catch (error) {
    console.error('API 错误:', error.message);
    res.status(500).send('无法获取文件');
  }
});

// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务运行在 http://localhost:${PORT}`);
});