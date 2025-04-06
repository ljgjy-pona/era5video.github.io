const videoContainer = document.getElementById('videoContainer');
const filters = {
  category: document.getElementById('categoryFilter'),
  resolution: document.getElementById('resolutionFilter'),
  search: document.getElementById('searchInput')
};

// 初始化加载
fetch('/videos.json')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status} 错误`);
    return res.json();
  })
  .then(renderVideos)
  .catch(error => {
    const errorHtml = `
      <div class="load-error">
        <h3>加载失败</h3>
        <p>原因：${error.message}</p>
        <button onclick="location.reload()">点击重试</button>
      </div>
    `;
    document.getElementById('videoContainer').innerHTML = errorHtml;
  });

function renderVideos(videos) {
  videoContainer.innerHTML = videos.map(video => `
    <article class="video-card" data-features="${JSON.stringify(video.features)}">
      <a href="/video.html?id=${video.id}">
        <img src="${video.preview}" 
             alt="${video.title}" 
             loading="lazy"
             class="video-thumbnail">
        <h3>${video.title}</h3>
        <div class="meta">
          <span class="resolution">${video.features.resolution}</span>
        </div>
      </a>
    </article>
  `).join('');
}

// 筛选逻辑
function handleFilter() {
  const searchTerm = filters.search.value.toLowerCase();
  const category = filters.category.value;
  const resolution = filters.resolution.value;

  Array.from(videoContainer.children).forEach(card => {
    const features = JSON.parse(card.dataset.features);
    const titleMatch = card.querySelector('h3').textContent.toLowerCase().includes(searchTerm);
    const categoryMatch = !category || features.category === category;
    const resolutionMatch = !resolution || features.resolution === resolution;
    
    card.style.display = (titleMatch && categoryMatch && resolutionMatch) ? 'block' : 'none';
  });
}

// 事件监听
Object.values(filters).forEach(filter => {
  filter.addEventListener('input', handleFilter);
});