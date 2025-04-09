// 修改后的完整筛选逻辑
function handleFilter() {
  const searchTerm = filters.search.value.trim().toLowerCase();
  const selectedYear = filters.category.value;
  const selectedVariable = filters.resolution.value;

  // 获取所有视频卡片
  const cards = Array.from(videoContainer.children);
  let hasVisibleItems = false;

  cards.forEach(card => {
    // 解析存储的视频特征数据
    const features = JSON.parse(card.dataset.features);
    const title = card.querySelector('h3').textContent.toLowerCase();
    
    // 构建匹配条件
    const matchesSearch = title.includes(searchTerm);
    const matchesYear = !selectedYear || features.category === selectedYear;
    const matchesVariable = !selectedVariable || features.resolution === selectedVariable;

    // 综合判断显示/隐藏
    const shouldShow = matchesSearch && matchesYear && matchesVariable;
    card.style.display = shouldShow ? 'block' : 'none';
    
    // 标记是否有可见项
    if (shouldShow) hasVisibleItems = true;
  });

  // 添加空状态提示
  if (!hasVisibleItems) {
    videoContainer.innerHTML = `
      <div class="empty-state">
        <img src="/images/not-found.svg" alt="无结果">
        <p>没有找到匹配的视频，请尝试其他筛选条件</p>
      </div>
    `;
  }
}

// 在数据加载完成后触发初始筛选
fetch('/videos.json')
  .then(res => res.json())
  .then(videos => {
    renderVideos(videos);
    handleFilter(); // 新增：初始化时应用筛选
  })
  .catch(handleError);

// 修正事件监听（注意英文分号）
filters.category.addEventListener('change', handleFilter);
filters.resolution.addEventListener('change', handleFilter);
filters.search.addEventListener('input', handleFilter); 
