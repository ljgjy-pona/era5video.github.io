const videoId = new URLSearchParams(window.location.search).get('id');

fetch('/videos.json')
  .then(res => res.json())
  .then(videos => {
    const videoData = videos.find(v => v.id == videoId);
    if (!videoData) throw new Error('视频不存在');

    // 生成Google Drive直连
    const videoUrl = `https://drive.google.com/uc?export=download&id=${videoData.driveid}`;

    // 初始化播放器
    const player = videojs('myVideo', {
      controls: true,
      fluid: true,
      sources: [{
        src: videoUrl,
        type: 'video/mp4'
      }]
    });

    // 设置下载链接
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.href = videoUrl;
    downloadBtn.download = `${videoData.title}.mp4`;

    // 页面标题
    document.title = `${videoData.title} - 视频播放`;
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML = `<div class="error">视频加载失败：${err.message}</div>`;
  });