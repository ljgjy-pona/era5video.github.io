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

  // 错误处理函数（移到内部）
  function handleError(error) {
    console.error('加载失败:', error);
    videoContainer.innerHTML = `<div class="error">加载视频数据失败: ${error.message}</div>`;
  }

  // 加载数据
  fetch('./videos.json')
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP 错误! 状态码: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (!validateVideoData(data)) {
        throw new Error('视频数据格式无效');
      }
      renderVideos(data);
      initFilters();
    })
    .catch(handleError);

  function validateVideoData(videos) {
    return Array.isArray(videos) && videos.every(video => {
      const hasTitle = !!video.title; // 确保标题存在
      const validFeatures = video.features && 
                          typeof video.features === 'object';
      return video.id && hasTitle && validFeatures;
    });
  }

  function renderVideos(videos) {
    videoContainer.innerHTML = videos.map(video => {
      return `
      <article class="video-card"
               data-category="${video.features?.category || ''}"
               data-resolution="${video.features?.resolution || ''}">
        <a href="video.html?id=${video.id}">
          <img src="${video.preview}" 
               alt="${video.title}" 
               loading="lazy">
          <h3>${video.title}</h3>
          <div class="meta">
            <span>${video.features?.category || ''}</span>
            <span>${video.features?.resolution || ''}</span>
          </div>
        </a>
      </article>
      `;
    }).join('');
    console.log('已渲染卡片数量:', videoContainer.children.length);
  }

  function initFilters() {
    if (!filters.category || !filters.resolution || !filters.search) {
      console.warn('部分筛选器元素未找到');
      return;
    }
    
    // 事件监听
    filters.category.addEventListener('change', handleFilter);
    filters.resolution.addEventListener('change', handleFilter);
    filters.search.addEventListener('input', debounce(handleFilter, 300));
  }

  function handleFilter() {
    const searchTerm = filters.search.value.toLowerCase();
    const selectedCategory = filters.category.value;
    const selectedResolution = filters.resolution.value;
  
    Array.from(videoContainer.children).forEach(card => {
      const category = card.dataset.category || '';
      const resolution = card.dataset.resolution || '';
      const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
  
      const shouldShow = (
        title.includes(searchTerm) &&
        (!selectedCategory || category === selectedCategory) &&
        (!selectedResolution || resolution === selectedResolution)
      );
  
      card.style.display = shouldShow ? 'block' : 'none';
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