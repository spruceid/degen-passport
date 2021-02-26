importScripts("flutter_service_worker.js");

chrome.runtime.onMessageExternal.addListener((request, sender, senderResponse) => {
  console.log(request, sender, senderResponse);
})

self.addEventListener("install", () => {
  chrome.windows.create({
    focused: true,
    url: chrome.runtime.getURL('index.html'),
    width: 338,
    height: 600,
    top: 64,
    left: 999999,
    type: "popup"
  })
 });
