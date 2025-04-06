let videos = [];

fetch('videos.json')
  .then(res => res.json())
  .then(data => {
    videos = data;
    renderVideos(data);
  });

function renderVideos(filteredVideos) {
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = filteredVideos.map(video => `
    <a href="video.html?id=${video.id}" class="video-card">
      <img src="${video.preview}" alt="${video.title}">
      <h3>${video.title}</h3>
    </a>
  `).join('');
}

// 筛选与搜索逻辑
document.querySelectorAll('select, #search').forEach(element => {
  element.addEventListener('input', () => {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const year = document.getElementById('year').value;
    const variable = document.getElementById('variable').value;

    const filtered = videos.filter(video => {
      return (video.title.toLowerCase().includes(searchTerm)) &&
             (!f1 || video.year === year) &&
             (!f2 || video.variable === variable);
    });
    renderVideos(filtered);
  });
});