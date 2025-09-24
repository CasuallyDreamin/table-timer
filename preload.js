const { contextBridge, ipcRenderer } = require("electron");
console.log("preload loaded");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, (e, args) => func(args)),
  logSession: (session) => ipcRenderer.send("log-session", session),
  getRecentSessions: (params) => ipcRenderer.invoke("get-recent-sessions", params)
});
