document.addEventListener('DOMContentLoaded', function() {
  // 获取元素添加null检查
  const videoContainer = document.getElementById('videoContainer');
  if (!videoContainer) {
    console.error('找不到视频容器元素');
    return;
  }

  // 初始化筛选器
  const filters = {
    category: document.getElementById('categoryFilter'),
    resolution: document.getElementById('resolutionFilter'),
    search: document.getElementById('searchInput')
  };

  // 加载数据
  fetch('./videos.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP错误 ${response.status}`);
      return response.json();
    })
    .then(videos => {
      if (!Array.isArray(videos)) throw new Error('无效的视频数据格式');
      renderVideos(videos);
    })
    .catch(error => {
      console.error('加载失败:', error);
      videoContainer.innerHTML = `
        <div class="error">
          <p>加载失败: ${error.message}</p>
          <button onclick="location.reload()">重试</button>
        </div>
      `;
    });
});

 function renderVideos(videos) {
  videoContainer.innerHTML = videos.map(video => {
    // 确保 features 存在
    const features = video.features || {};
    
    // 使用直接数据属性替代 JSON
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
  const searchTerm = filters.search.value.toLowerCase();
  const year = filters.category.value;
  const variable = filters.resolution.value;

  Array.from(videoContainer.children).forEach(card => {
    try {
      // 直接使用 dataset 属性，不再解析 JSON
      const category = card.dataset.category || '';
      const resolution = card.dataset.resolution || '';
      const titleEl = card.querySelector('h3');
      
      // 安全检查
      if (!titleEl) {
        console.warn('视频卡片缺少标题元素', card);
        card.style.display = 'none';
        return;
      }

      const title = titleEl.textContent.toLowerCase();
      
      // 匹配条件
      const matches = (
        title.includes(searchTerm) &&
        (!year || category === year) &&
        (!variable || resolution === variable)
      );

      card.style.display = matches ? 'block' : 'none';
    } catch (e) {
      console.error('过滤视频时出错:', e);
      card.style.display = 'none';
    }
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