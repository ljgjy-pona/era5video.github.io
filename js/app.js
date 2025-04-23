document.addEventListener('DOMContentLoaded', function() {
  const videoContainer = document.getElementById('videoContainer');
  if (!videoContainer) return;

  const filters = {
    category: document.getElementById('categoryFilter'),
    resolution: document.getElementById('resolutionFilter'),
    search: document.getElementById('searchInput')
  };

  // 显示加载状态
  videoContainer.innerHTML = '<div class="loading">加载视频数据中...</div>';

  // 使用相对路径确保能找到文件
  fetch('./videos.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP错误 ${response.status}`);
      return response.json();
    })
    .then(videos => {
      if (!Array.isArray(videos)) throw new Error('无效的视频数据格式');
      renderVideos(videos);
      initFilters(); // 初始化筛选器事件
    })
    .catch(error => {
      console.error('加载失败:', error);
      videoContainer.innerHTML = `
        <div class="error">
          <p>加载视频失败: ${error.message}</p>
          <button onclick="window.location.reload()">重试</button>
        </div>
      `;
    });

  function renderVideos(videos) {
    videoContainer.innerHTML = videos.map(video => {
      const features = video.features || {};
      return `
        <article class="video-card" 
                 data-category="${features.category || ''}"
                 data-resolution="${features.resolution || ''}">
          <a href="video.html?id=${video.id}">
            <img src="${video.preview || 'assets/images/default.jpg'}" 
                 alt="${video.title || '无标题视频'}" 
                 loading="lazy">
            <h3>${video.title || '未命名视频'}</h3>
            <div class="meta">
              <span>${features.category || '未知年份'}</span>
              <span>${features.resolution || '未知类型'}</span>
            </div>
          </a>
        </article>
      `;
    }).join('');
  }

  function initFilters() {
    if (!filters.category || !filters.resolution || !filters.search) return;
    
    // 事件监听
    filters.category.addEventListener('change', handleFilter);
    filters.resolution.addEventListener('change', handleFilter);
    filters.search.addEventListener('input', debounce(handleFilter, 300));
  }

  function handleFilter() {
    if (!videoContainer.children.length) return;

    const searchTerm = filters.search.value.toLowerCase();
    const year = filters.category.value;
    const variable = filters.resolution.value;

    Array.from(videoContainer.children).forEach(card => {
      const titleEl = card.querySelector('h3');
      if (!titleEl) {
        card.style.display = 'none';
        return;
      }

      const matches = (
        titleEl.textContent.toLowerCase().includes(searchTerm) &&
        (!year || card.dataset.category === year) &&
        (!variable || card.dataset.resolution === variable)
      );

      card.style.display = matches ? 'block' : 'none';
    });
  }

  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
  }
});