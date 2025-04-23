const videoContainer = document.getElementById('videoContainer');
const filters = {
  category: document.getElementById('categoryFilter'),
  resolution: document.getElementById('resolutionFilter'),
  search: document.getElementById('searchInput')
};

// 显示加载状态
videoContainer.innerHTML = '<div class="loading">加载中...</div>';

// 初始化加载
fetch('/videos.json')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status} 错误`);
    return res.json();
  })
  .then(videos => {
    if (!Array.isArray(videos)) {
      throw new Error('无效的视频数据格式');
    }
    renderVideos(videos);
  })
  .catch(error => {
    console.error('加载视频失败:', error);
    const errorHtml = `
      <div class="load-error">
        <h3>加载失败</h3>
        <p>原因：${error.message}</p>
        <button onclick="location.reload()">点击重试</button>
      </div>
    `;
    videoContainer.innerHTML = errorHtml;
  });

function renderVideos(videos) {
  videoContainer.innerHTML = videos.map(video => {
    // 确保features存在且是对象
    const features = video.features || {};
    return `
    <article class="video-card" data-features="${JSON.stringify(features).replace(/"/g, '&quot;')}">
      <a href="/video.html?id=${video.id}">
        <img src="${video.preview || '/images/default-preview.jpg'}" 
             alt="${video.title || '无标题视频'}" 
             loading="lazy"
             class="video-thumbnail">
        <h3>${video.title || '无标题视频'}</h3>
        <div class="meta">
          <span class="resolution">${features.resolution || '未知变量'}</span>
          <span class="year">${features.category || '未知年份'}</span>
        </div>
      </a>
    </article>
  `}).join('');
}

function handleFilter() {
  const searchTerm = filters.search.value.toLowerCase();
  const year = filters.category.value;
  const variable = filters.resolution.value;

  Array.from(videoContainer.children).forEach(card => {
    try {
      const features = JSON.parse(card.dataset.features || '{}');
      const title = card.querySelector('h3').textContent.toLowerCase();
      const titleMatch = title.includes(searchTerm);
      const yearMatch = !year || features.category === year;
      const variableMatch = !variable || features.resolution === variable;
      
      card.style.display = (titleMatch && yearMatch && variableMatch) ? 'block' : 'none';
    } catch (e) {
      console.error('解析视频特征时出错:', e);
      card.style.display = 'none';
    }
  });
}

// 事件监听
filters.category.addEventListener('change', handleFilter);
filters.resolution.addEventListener('change', handleFilter);
filters.search.addEventListener('input', handleFilter);