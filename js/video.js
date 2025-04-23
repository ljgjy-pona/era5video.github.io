const videoId = new URLSearchParams(window.location.search).get('id');

fetch('/videos.json')
  .then(res => res.json())
  .then(videos => {
    const videoData = videos.find(v => v.id == videoId);
    if (!videoData) throw new Error('视频不存在');

    // 方案1：使用预览链接（需确保权限公开）
    const driveUrl = `https://drive.google.com/file/d/${videoData.driveid}/preview`;

    // 方案2：使用API直连（需配置API Key）
    // const driveUrl = `https://www.googleapis.com/drive/v3/files/${videoData.driveid}?alt=media&key=YOUR_API_KEY`;

    const player = videojs('myVideo', {
      controls: true,
      fluid: true,
      techOrder: ['html5'], // 强制HTML5模式
      sources: [{
        src: driveUrl,
        type: videoData.format || 'video/mp4' // 动态匹配格式
      }]
    });

    player.on('error', (err) => {
      console.error('播放器错误:', err);
      player.createModal(`
        <div style="padding: 20px">
          <h3>视频加载失败</h3>
          <p>错误代码: ${err.code}</p>
          <a href="${driveUrl}" target="_blank" style="color: white">尝试直接下载</a>
        </div>
      `);
    });

    // 下载链接
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.href = `https://drive.google.com/uc?export=download&id=${videoData.driveid}`;
    downloadBtn.download = `${videoData.title}.${videoData.format || 'mp4'}`;
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML = `
      <div class="error">
        <h2>加载失败</h2>
        <p>${err.message}</p>
        <button onclick="location.reload()">重试</button>
      </div>
    `;
  });
