// Tab Selection
document.addEventListener("DOMContentLoaded", function() {
    // Get both tabs at once
    const featuredTab = document.querySelector('a[data-w-tab="Featured"]');
    const upNextTab = document.querySelector('a[data-w-tab="Up Next"]');

    // If "Featured Videos" tab is not visible, activate "Up Next" tab
    if (featuredTab && !featuredTab.offsetParent && upNextTab) {
        upNextTab.classList.add('w--current');
    }
});

// Copy to Clipboard
  function copyToClipboard() {
    const copyText = document.getElementById("shareURL");
    copyText.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
  }

// Search Focus
document.addEventListener('DOMContentLoaded', function () {
  const searchTab = document.querySelector('#search-tab');
  const searchInput = document.querySelector('.in-line-search');

  if (searchTab && searchInput) {
    searchTab.addEventListener('click', function () {
      setTimeout(() => {
        searchInput.focus();
      }, 300);
    });
  }
});
