const videoId = new URLSearchParams(window.location.search).get('id');

fetch('/videos.json')
  .then(res => res.json())
  .then(videos => {
    const videoData = videos.find(v => v.id == videoId);
    if (!videoData) throw new Error('视频不存在');

    // 生成Google Drive直连
   const driveUrl = `https://drive.google.com/uc?export=download&id=${videoData.driveid}`;

const player = videojs('myVideo', {
  controls: true,
  fluid: true,
  sources: [{
    src: driveUrl,
    type: 'video/mp4' // 确保与实际格式匹配
  }]
});

// 添加错误处理
player.on('error', () => {
  player.createModal('视频加载失败，请尝试下载观看');
});

    // 设置下载链接
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.href = driveUrl;
    downloadBtn.download = `${videoData.title}.mp4`;

    // 页面标题
    document.title = `${videoData.title} - 视频播放`;
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML = `<div class="error">视频加载失败：${err.message}</div>`;
  });