const I18N_STRINGS = {
  ko: {
    pageTitle: 'OnNews',
    writeButton: '글쓰기',
    listButton: '목록',
    editButton: '수정',
    deleteButton: '삭제',
    writePageTitle: '글쓰기',
    editPageTitle: '글 수정',
    formLabelTitle: '제목',
    formLabelContent: '내용',
    formLabelTags: '태그',
    formPlaceholderTitle: '제목을 입력하세요',
    formPlaceholderContent: '내용을 입력하세요',
    formPlaceholderTags: '태그 (쉼표로 구분)',
    submitButton: '등록하기',
    updateButton: '수정하기',
    footer: '© 2026 OnNews. All rights reserved.',
    newsFetchError: '뉴스를 불러오지 못했습니다.',
    noNews: '등록된 뉴스가 없습니다.',
    deletedSuccessfully: '삭제되었습니다.',
    areYouSureDelete: '정말 삭제하시겠습니까?',
    unauthorized: '권한이 없습니다.',
    titleContentRequired: '제목과 내용은 필수입니다.',
    postedSuccessfully: '등록되었습니다.',
    updatedSuccessfully: '수정되었습니다.',
    adminPasswordPrompt: '관리자 비밀번호를 입력하세요',
    viewsCountLabel: '조회수',
  },
  en: {
    pageTitle: 'OnNews',
    writeButton: 'Write',
    listButton: 'List',
    editButton: 'Edit',
    deleteButton: 'Delete',
    writePageTitle: 'Write New Post',
    editPageTitle: 'Edit Post',
    formLabelTitle: 'Title',
    formLabelContent: 'Content',
    formLabelTags: 'Tags',
    formPlaceholderTitle: 'Enter title',
    formPlaceholderContent: 'Enter content',
    formPlaceholderTags: 'Tags (comma-separated)',
    submitButton: 'Submit',
    updateButton: 'Update',
    footer: '© 2026 OnNews. All rights reserved.',
    newsFetchError: 'Failed to load news.',
    noNews: 'No news has been registered.',
    deletedSuccessfully: 'Deleted successfully.',
    areYouSureDelete: 'Are you sure you want to delete this?',
    unauthorized: 'Unauthorized.',
    titleContentRequired: 'Title and content are required.',
    postedSuccessfully: 'Posted successfully.',
    updatedSuccessfully: 'Updated successfully.',
    adminPasswordPrompt: 'Enter admin password',
    viewsCountLabel: 'Views',
  }
};

let currentLang = localStorage.getItem('lang') || 'ko';
let originalNewsData = [];

async function translateText(text, from, to) {
  if (!text || from === to) return text;
  await new Promise(resolve => setTimeout(resolve, 200));
  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) return text;
    const data = await response.json();
    return data.responseStatus === 200 ? data.responseData.translatedText : text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

function translateStaticElements(lang) {
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    if (I18N_STRINGS[lang]?.[key]) {
      el.innerText = I18N_STRINGS[lang][key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (I18N_STRINGS[lang]?.[key]) {
      el.placeholder = I18N_STRINGS[lang][key];
    }
  });
}

function setLanguage(lang) {
  if (lang === currentLang) return; // Keep this check to prevent unnecessary re-runs
  currentLang = lang;
  localStorage.setItem('lang', lang);

  document.querySelectorAll('.lang-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  translateStaticElements(lang);

  // Trigger dynamic content translation if the function exists
  if (typeof translateDynamicContent === 'function') {
    translateDynamicContent(lang);
  }
}

// Translate dynamic content on the news list page
async function translateNewsList(lang) {
  const newsList = document.getElementById("news-list");
  if (!newsList || !originalNewsData.length) return;

  const itemsToTranslate = Array.from(newsList.children);
  for (let i = 0; i < itemsToTranslate.length; i++) {
    const li = itemsToTranslate[i];
    const originalItem = originalNewsData[i];
    if (!originalItem) continue;

    const titleElement = li.querySelector('.news-item-title');
    if (titleElement) {
      titleElement.innerText = lang === 'ko' ? originalItem.title : await translateText(originalItem.title, 'ko', 'en');
    }
  }
}

// Add a generic dynamic translation trigger for other pages
function translateDynamicContent(lang) {
  if (document.getElementById('news-list')) {
    translateNewsList(lang);
  }
  if (typeof translateViewContent === 'function') {
    translateViewContent(lang);
  }
  // Add other dynamic content translations here if needed for other pages
}

// Apply stored language on page load
document.addEventListener('DOMContentLoaded', () => {
  // Set button states and translate static text
  setLanguage(currentLang);

  // Add event listeners for language buttons
  const langKoBtn = document.getElementById('lang-ko');
  const langEnBtn = document.getElementById('lang-en');
  if(langKoBtn && langEnBtn) {
    langKoBtn.addEventListener('click', () => setLanguage('ko'));
    langEnBtn.addEventListener('click', () => setLanguage('en'));
  }
});

function formatDateToLocal(dateString) {
  if (!dateString) return '';
  try {
    // Append 'Z' to indicate UTC if timezone is not specified
    const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch (e) {
    console.error('Failed to format date:', e);
    return dateString; // Return original string on error
  }
}
