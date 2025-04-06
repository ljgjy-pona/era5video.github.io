// 初始化加载
document.addEventListener('DOMContentLoaded', loadVideos);

// 过滤功能
document.getElementById('searchInput').addEventListener('input', filterVideos);
document.getElementById('yearFilter').addEventListener('change', filterVideos);
document.getElementById('categoryFilter').addEventListener('change', filterVideos);

function filterVideos() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const year = document.getElementById('yearFilter').value;
  const category = document.getElementById('categoryFilter').value;

  // 实现多条件过滤逻辑
  const filtered = window.videoData.filter(video => {
    return (video.title.toLowerCase().includes(searchTerm) || 
            video.description.toLowerCase().includes(searchTerm)) &&
           (year === "" || video.year == year) &&
           (category === "" || video.category === category);
  });

  renderVideos(filtered);
}

// 渲染视频卡片
function renderVideos(videos) {
  const container = document.getElementById('videoContainer');
  container.innerHTML = videos.map(video => `
    <div class="video-card">
      <img src="${video.thumbnail}" alt="${video.title}">
      <div class="card-info">
        <h3>${video.title}</h3>
        <p>年份：${video.year}</p>
        <p>分类：${video.category}</p>
        <a href="video.html?id=${video.id}" class="play-btn">观看视频</a>
      </div>
    </div>
  `).join('');
}
