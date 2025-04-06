// js/video.js
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('id');

  fetch('../videos.json')
    .then(response => response.json())
    .then(videos => {
      const video = videos.find(v => v.id == videoId);
      if (!video) throw new Error('视频不存在');

      // 动态生成Google Drive直连
      const directUrl = `https://drive.google.com/uc?export=download&id=${video.driveid}`;
      
      // 初始化播放器
      const player = videojs('myVideo', {
        controls: true,
        autoplay: false,
        preload: 'auto',
        sources: [{
          src: directUrl,
          type: 'video/mp4'
        }]
      });

      // 设置下载链接
      const downloadBtn = document.getElementById('downloadBtn');
      downloadBtn.href = directUrl;
      downloadBtn.download = `${video.title}.mp4`; 

      // 更新页面标题
      document.title = `${video.title} - 视频播放`;
    })
    .catch(error => {
      console.error('加载失败:', error);
      document.body.innerHTML = `<div class="error">视频加载失败: ${error.message}</div>`;
    });
});