const videoContainer = document.getElementById('videoContainer');
const filters = {
  category: document.getElementById('categoryFilter'),
  resolution: document.getElementById('resolutionFilter'),
  search: document.getElementById('searchInput')
};

let allVideos = [];

function renderVideos(videos) {
  if (videos.length === 0) {
    videoContainer.innerHTML = `
      <div class="empty-state">
        <p>没有找到匹配的资源</p>
      </div>
    `;
  } else {
    videoContainer.innerHTML = videos.map(video => {
      const safePreview = encodeURI(video.preview);
      const safeTitle = escapeHtml(video.title);
      const featuresJSON = JSON.stringify(video.features)
        .replace(/</g, '\\u003c');

      return `
        <article class="video-card">
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
}

/​**​
 * 应用筛选条件
 */
function applyFilters() {
  const searchTerm = filters.search.value.trim().toLowerCase();
  const selectedCategory = filters.category.value;
  const selectedResolution = filters.resolution.value;

  const filteredVideos = allVideos.filter(video => {
    const title = video.title.toLowerCase();
    const matchesSearch = title.includes(searchTerm);
    const matchesCategory = !selectedCategory || video.features.category === selectedCategory;
    const matchesResolution = !selectedResolution || video.features.resolution === selectedResolution;

    return matchesSearch && matchesCategory && matchesResolution;
  });

  renderVideos(filteredVideos);
}

/​**​
 * HTML转义防止XSS
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

// 初始化加载
function initialize() {
  fetch('/videos.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP错误 ${response.status}`);
      return response.json();
    })
    .then(videos => {
      allVideos = videos;
      applyFilters();
    })
    .catch(handleError);
}

// 事件监听
filters.category.addEventListener('change', applyFilters);
filters.resolution.addEventListener('change', applyFilters);
filters.search.addEventListener('input', applyFilters);

// 启动应用
initialize();
});
