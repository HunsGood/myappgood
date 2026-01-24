const API_BASE = "https://news-api.hproject13579.workers.dev";

const params = new URLSearchParams(location.search);
const id = params.get("id");

let originalArticleTitle = '';
let originalArticleContent = '';

async function incrementViewCount() {
  try {
    // This is a hypothetical endpoint. The actual backend needs to support this.
    await fetch(`${API_BASE}/api/news/${id}/views`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ increment: 1 })
    });
    // Frontend could update views visually here if successful, but for now, rely on refetch
  } catch (e) {
    console.error("Failed to increment view count (backend support needed):", e);
  }
}

async function loadDetail() {
  const res = await fetch(`${API_BASE}/api/news/${id}`);
  const data = await res.json();

  originalArticleTitle = data.title;
  originalArticleContent = data.content;
  
  // Format date and display
  document.getElementById("created-at").innerText = formatDateToLocal(data.created_at);
  
  // Display views (will be 0 if not provided by backend)
  document.getElementById("views").innerText = `${I18N_STRINGS[currentLang].viewsCountLabel}: ${data.views ?? 0}`; // Initial display
  
  // Apply translations for static elements and dynamic content
  translateStaticElements(currentLang);
  translateViewContent(currentLang);

  // Store original tags for translation
  const tagsElement = document.getElementById("tags");
  if (tagsElement && data.tags) {
      tagsElement.dataset.originalTags = data.tags;
  }
}

// Function to translate and update dynamic content on view.html
async function translateViewContent(lang) {
  document.getElementById("title").innerText = lang === 'ko' ? originalArticleTitle : await translateText(originalArticleTitle, 'ko', 'en');
  document.getElementById("content").innerText = lang === 'ko' ? originalArticleContent : await translateText(originalArticleContent, 'ko', 'en');

  const tagsElement = document.getElementById("tags");
  if (tagsElement) {
    const tagsText = tagsElement.dataset.originalTags || '';
    if (tagsText) {
      tagsElement.innerText = `${lang === 'ko' ? '태그' : 'Tags'}: ${tagsText}`;
      tagsElement.style.display = 'inline-block';
    } else {
      tagsElement.style.display = 'none';
    }
  }
  // The views count text itself needs to be translated
  const viewsElement = document.getElementById("views");
  if(viewsElement) {
    const currentViews = viewsElement.innerText.split(': ')[1] || '0';
    viewsElement.innerText = `${I18N_STRINGS[lang].viewsCountLabel}: ${currentViews}`;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
    // This will load data and then trigger initial translation
    await loadDetail(); 

    // Attempt to increment view count after the detail is loaded and displayed
    // This requires backend API support for a PATCH /api/news/{id}/views endpoint
    await incrementViewCount();
    
    // After increment, refetch the detail to get updated view count
    // This makes sure the displayed view count is fresh, assuming backend incremented it
    await loadDetail();
});


const deleteBtn = document.getElementById("deleteBtn");
const editBtn = document.getElementById("editBtn");

deleteBtn.addEventListener("click", async () => {
  if (!confirm(I18N_STRINGS[currentLang].areYouSureDelete)) return;

  const res = await fetch(`${API_BASE}/api/news/${id}`, {
    method: "DELETE"
  });

  const result = await res.json();

  if (result.success) {
    alert(I18N_STRINGS[currentLang].deletedSuccessfully);
    location.href = "index.html";
  }
});

editBtn.addEventListener("click", () => {
  location.href = `write.html?id=${id}`;
});
