self.addEventListener("install", () => {
  chrome.windows.create({
    focused: true,
    url: chrome.runtime.getURL('index.html'),
    width: 394,
    height: 700,
    top: 64,
    left: 999999,
    type: "popup"
  });
});

const clients = new Map();
const events = new Map();

/// REQUESTER
chrome.runtime.onMessageExternal.addListener((request, sender, callback) => {
  chrome.windows.create({
    focused: true,
    url: chrome.runtime.getURL("index.html"),
    width: 394,
    height: 700,
    top: 64,
    left: 999999,
    type: "popup",
  }, (w) => {
    clients[w.tabs[0].id] = callback;
    events[w.tabs[0].id] = {
      ...request,
      origin: sender.origin || "unknown origin",
    };
  });
});

/// RESPONDER
chrome.runtime.onConnect.addListener((port) => {
  const tabId = port.sender.tab.id;

  const timeout = setTimeout(() => port.disconnect(), 30000);

  port.onDisconnect.addListener((_) => {
    clearTimeout(timeout);
    clients[tabId](null);
    clients.delete(tabId);
    port.disconnect();
  });

  port.onMessage.addListener((e) => {
    clearTimeout(timeout);
    clients[tabId](e);
    clients.delete(tabId);
    port.disconnect();
  });

  port.postMessage(events[tabId]);
  events.delete(tabId);
});
