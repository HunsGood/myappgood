const ADMIN_PASSWORD = "1234"; // 원하는 비밀번호로 변경
const auth = sessionStorage.getItem("onnews_admin");

// Global variables for form content and its current language
let originalFormValues = { ko: {}, en: {} };
let currentFormLang; // Will be initialized by translate.js's currentLang

// Ensure translate.js has loaded and currentLang is available
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize currentFormLang based on the global currentLang from translate.js
  if (typeof currentLang !== 'undefined') {
    currentFormLang = currentLang;
  } else {
    // Fallback if translate.js not yet fully loaded
    currentFormLang = localStorage.getItem('lang') || 'ko';
  }

  // Admin authentication check
  if (!auth) {
    const input = prompt(I18N_STRINGS[currentFormLang].adminPasswordPrompt || (currentFormLang === 'ko' ? "관리자 비밀번호를 입력하세요" : "Enter admin password"));
    if (input !== ADMIN_PASSWORD) {
      alert(I18N_STRINGS[currentFormLang].unauthorized);
      location.href = "index.html";
    } else {
      sessionStorage.setItem("onnews_admin", "ok");
    }
  }

  // Initial static translations (for form labels and placeholders)
  if (typeof translateStaticElements === 'function') {
    translateStaticElements(currentFormLang);
  }

  // For new post, ensure initial form fields are also translated if currentFormLang is not ko
  if (!id && currentFormLang !== 'ko') {
    // If it's a new post and not in Korean, apply form field translation
    // (This mostly handles placeholders and ensures subsequent dynamic translation works)
    translateFormFields(currentFormLang);
  }
});


const API_BASE = "https://news-api.hproject13579.workers.dev";

const params = new URLSearchParams(location.search);
const id = params.get("id");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const tagsInput = document.getElementById("tags");
const submitBtn = document.getElementById("submit");

// Function to translate form fields
async function translateFormFields(targetLang) {
  if (targetLang === currentFormLang) return; // No change needed

  // Store current values before translating
  const currentTitle = titleInput.value;
  const currentContent = contentInput.value;
  const currentTags = tagsInput.value;

  // Translate and update input fields
  titleInput.value = targetLang === 'ko' && originalFormValues.ko.title ? originalFormValues.ko.title : await translateText(currentTitle, currentFormLang, targetLang);
  contentInput.value = targetLang === 'ko' && originalFormValues.ko.content ? originalFormValues.ko.content : await translateText(currentContent, currentFormLang, targetLang);
  tagsInput.value = targetLang === 'ko' && originalFormValues.ko.tags ? originalFormValues.ko.tags : await translateText(currentTags, currentFormLang, targetLang);

  currentFormLang = targetLang; // Update the current language of the form fields
}

// Global function for dynamic content translation on write page, called from translate.js
function translateWritePageForm(lang) {
    translateFormFields(lang);
}

// 수정 모드일 경우 기존 데이터 불러오기
if (id) {
  document.getElementById('page-title').setAttribute('data-i18n-key', 'editPageTitle');
  submitBtn.setAttribute('data-i18n-key', 'updateButton');
  
  // Ensure static translations for page title and button are applied
  if (typeof translateStaticElements === 'function') {
    translateStaticElements(currentFormLang);
  }

  fetch(`${API_BASE}/api/news/${id}`)
    .then(res => res.json())
    .then(data => {
      // Store original Korean values
      originalFormValues.ko.title = data.title;
      originalFormValues.ko.content = data.content;
      originalFormValues.ko.tags = data.tags || "";

      // Set form values
      titleInput.value = data.title;
      contentInput.value = data.content;
      tagsInput.value = data.tags || "";

      // If current language is English, translate fetched data
      if (currentFormLang === 'en') {
        translateFormFields('en');
      }
    });
} else {
    document.getElementById('page-title').setAttribute('data-i18n-key', 'writePageTitle');
    submitBtn.setAttribute('data-i18n-key', 'submitButton');
}


submitBtn.addEventListener("click", async () => {
  let title = titleInput.value.trim();
  let content = contentInput.value.trim();
  let tags = tagsInput.value.trim();

  if (!title || !content) {
    alert(I18N_STRINGS[currentFormLang].titleContentRequired);
    return;
  }

  // If the current form content is in English, translate it back to Korean for the API
  if (currentFormLang === 'en') {
    title = await translateText(title, 'en', 'ko');
    content = await translateText(content, 'en', 'ko');
    tags = await translateText(tags, 'en', 'ko');
  }

  const method = id ? "PUT" : "POST";
  const url = id
    ? `${API_BASE}/api/news/${id}`
    : `${API_BASE}/api/news`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, tags })
  });

  const result = await res.json();

  if (result.success) {
    alert(id ? I18N_STRINGS[currentFormLang].updatedSuccessfully : I18N_STRINGS[currentFormLang].postedSuccessfully);
    location.href = "index.html";
  }
});
