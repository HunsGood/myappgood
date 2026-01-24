const newsList = document.getElementById("news-list");
const API_BASE = "https://news-api.hproject13579.workers.dev";

function renderNews(data) {
  newsList.innerHTML = ""; // Clear existing list

  if (!data || data.length === 0) {
    newsList.innerHTML = `<li>${I18N_STRINGS[currentLang].noNews}</li>`;
    return;
  }

  data.forEach(item => {
    const li = document.createElement("li");
    li.className = 'news-item';

    const formattedTime = formatDateToLocal(item.created_at);

    li.innerHTML = `
      <a href="view.html?id=${item.id}">
        <div class="news-item-title">${item.title}</div>
        <div class="news-item-meta">
          <span class="news-item-views">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.12 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.133 13.133 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>
            123
          </span>
          <time class="news-item-time">${formattedTime}</time>
        </div>
      </a>
    `;
    newsList.appendChild(li);
  });
}

async function loadNews() {
  try {
    const res = await fetch(`${API_BASE}/api/news`);
    const data = await res.json();
    
    // Store original data for translation purposes
    originalNewsData = data;
    
    // Render the initial list
    renderNews(originalNewsData);
    
    // If the current language is not Korean, translate the list
    if (currentLang !== 'ko') {
      translateNewsList(currentLang);
    }

  } catch (e) {
    newsList.innerHTML = `<li>${I18N_STRINGS[currentLang].newsFetchError}</li>`;
    console.error(e);
  }
}

// Initial load
loadNews();

// Event listener for write button
document.getElementById("writeBtn").addEventListener("click", () => {
  location.href = "write.html";
});
