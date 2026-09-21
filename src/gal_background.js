chrome.action.onClicked.addListener((activeTab) => {
  const newURL = chrome.runtime.getURL('gallery.html');
  chrome.tabs.create({ url: newURL });
});