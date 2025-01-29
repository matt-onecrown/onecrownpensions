document.addEventListener("DOMContentLoaded", function() {
    const copyButton = document.getElementById("copyButton");
    if (copyButton) {
        copyButton.addEventListener("click", function() {
            const link = "https://www.onecrownpensions.com/ssas-video-hub/refer-a-friend?share-link";
            navigator.clipboard.writeText(link)
                .then(() => alert("Link copied to clipboard!"))
                .catch(err => console.error("Failed to copy: ", err));
        });
    }
});
