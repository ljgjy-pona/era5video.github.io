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
    // 确保 features 存在
    const features = video.features || {};
    
    // 安全序列化（双重转义处理）
    const featuresStr = JSON.stringify(features)
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
    
    return `
    <article class="video-card" 
             data-features='${featuresStr}'
             data-category="${features.category || ''}"
             data-resolution="${features.resolution || ''}">
      <!-- 其余内容保持不变 -->
    </article>
    `;
  }).join('');
}

function handleFilter() {
  const searchTerm = filters.search.value.toLowerCase();
  const year = filters.category.value;
  const variable = filters.resolution.value;

  Array.from(videoContainer.children).forEach(card => {
    // 使用 dataset 直接访问属性
    const category = card.dataset.category;
    const resolution = card.dataset.resolution;
    
    const title = card.querySelector('h3').textContent.toLowerCase();
    
    const matches = (
      title.includes(searchTerm) &&
      (!year || category === year) &&
      (!variable || resolution === variable)
    );
    
    card.style.display = matches ? 'block' : 'none';
  });
}

// 事件监听
filters.category.addEventListener('change', handleFilter);
filters.resolution.addEventListener('change', handleFilter);
filters.search.addEventListener('input', handleFilter);