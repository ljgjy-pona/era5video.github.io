const videoContainer = document.getElementById('videoContainer');
const filters = {
  category: document.getElementById('categoryFilter'),
  resolution: document.getElementById('resolutionFilter'),
  search: document.getElementById('searchInput')
};

// ========== 核心函数 ==========
/​**​
 * 渲染视频列表
 * @param {Array} videos - 视频数据数组 
 */
function renderVideos(videos) {
  videoContainer.innerHTML = videos.map(video => {
    // 转义特殊字符防止XSS
    const safePreview = encodeURI(video.preview);
    const safeTitle = escapeHtml(video.title);
    const featuresJSON = JSON.stringify(video.features)
      .replace(/</g, '\\u003c'); // 转义HTML敏感字符

    return `
      <article class="video-card" data-features='${featuresJSON}'>
        <a href="/video.html?id=${video.id}">
          <img src="${safePreview}" 
               alt="${safeTitle}" 
               loading="lazy"
               onerror="this.src='/assets/images/default.png'"
               class="video-thumbnail">
          <h3>${safeTitle}</h3>
          <div class="meta">
            <span class="year">${escapeHtml(video.features.category)}</span>
            <span class="variable">${escapeHtml(video.features.resolution)}</span>
          </div>
        </a>
      </article>
    `;
  }).join('');
}

/​**​
 * 处理筛选逻辑
 */
function handleFilter() {
  const searchTerm = filters.search.value.trim().toLowerCase();
  const selectedYear = filters.category.value;
  const selectedVariable = filters.resolution.value;

  const cards = Array.from(videoContainer.children);
  let hasVisibleItems = false;

  cards.forEach(card => {
    try {
      const features = JSON.parse(card.dataset.features);
      const title = card.querySelector('h3').textContent.toLowerCase();
      
      const matchesSearch = title.includes(searchTerm);
      const matchesYear = !selectedYear || features.category === selectedYear;
      const matchesVariable = !selectedVariable || features.resolution === selectedVariable;

      const shouldShow = matchesSearch && matchesYear && matchesVariable;
      card.style.display = shouldShow ? 'block' : 'none';
      
      if (shouldShow) hasVisibleItems = true;
    } catch (error) {
      console.error('卡片解析错误:', error);
      card.style.display = 'none';
    }
  });

  videoContainer.innerHTML = hasVisibleItems ? videoContainer.innerHTML : `
    <div class="empty-state">
      <p>没有找到匹配的资源</p>
    </div>
  `;
}

// ========== 工具函数 ==========
/​**​
 * HTML转义防止XSS攻击
 * @param {string} text 
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/​**​
 * 统一错误处理
 * @param {Error} error 
 */
function handleError(error) {
  console.error('全局错误:', error);
  videoContainer.innerHTML = `
    <div class="error-state">
      <p>数据加载失败: ${error.message}</p>
      <button onclick="window.location.reload()">重试</button>
    </div>
  `;
}

// ========== 初始化加载 ==========
function initialize() {
  fetch('/videos.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP错误 ${response.status}`);
      return response.json();
    })
    .then(videos => {
      renderVideos(videos);
      handleFilter(); // 初始筛选
    })
    .catch(handleError);
}

// ========== 事件监听 ==========
filters.category.addEventListener('change', handleFilter);
filters.resolution.addEventListener('change', handleFilter);
filters.search.addEventListener('input', handleFilter);

// 启动应用
initialize();
