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
    .then(res => res.json())
    .then(data => {
      if (!validateVideoData(data)) {
        throw new Error('Invalid video data structure');
      }
      return data;
    })
    .then(renderVideos)
    .then(initFilters) // 添加这行来初始化过滤器
    .catch(handleError);

  function handleError(error) {
    console.error('加载失败:', error);
    videoContainer.innerHTML = `
      <div class="error">
        <p>加载失败: ${error.message}</p>
        <button onclick="location.reload()">重试</button>
      </div>
    `;
  }

  function validateVideoData(videos) {
    return Array.isArray(videos) && videos.every(video => {
      return video.id && video.title && video.features;
    });
  }

  function renderVideos(videos) {
    videoContainer.innerHTML = videos.map(video => {
      // 直接存储原始值到DOM属性，避免JSON处理
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
  }
  console.log('已渲染卡片数量:', videoContainer.children.length);
  
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
    const year = filters.category.value;
    const variable = filters.resolution.value;

    Array.from(videoContainer.children).forEach(card => {
      try {
        // 直接读取DOM属性，完全跳过JSON解析
        const category = card.dataset.category;
        const resolution = card.dataset.resolution;
        const titleEl = card.querySelector('h3');
        
        if (!titleEl) {
          console.warn('卡片缺少标题元素', card);
          card.style.display = 'none';
          return;
        }

        const title = titleEl.textContent.toLowerCase();
        
        const shouldShow = (
          title.includes(searchTerm) &&
          (!year || category === year) &&
          (!variable || resolution === variable)
        );

        card.style.display = shouldShow ? 'block' : 'none';
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