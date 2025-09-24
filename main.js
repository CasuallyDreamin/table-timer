const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { logSession, getRecentSessions, getTotalSessions } = require("./database");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load Vite dev server
  win.loadURL("http://localhost:5173").catch(err => {
    console.error("Failed to load URL:", err);
  });

  win.webContents.openDevTools();
}

ipcMain.on("log-session", async (event, session) => {
  try {
    await logSession(session);
  } catch (err) {
    console.error("Failed to log session:", err);
  }
});

ipcMain.on("open-full-history", () => {
  const historyWin = new BrowserWindow({
    width: 900,
    height: 700,
    title: "Full History",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const url =
    process.env.NODE_ENV === "development"
    ? "http://localhost:5173" // load main app
    : `file://${path.join(__dirname, "renderer", "dist", "index.html")}`;
  
    historyWin.loadURL(url);

});

ipcMain.handle("get-recent-sessions", async (event, { limit = 50, offset = 0 } = {}) => {
  try {
    const rows = await getRecentSessions(limit, offset);
    const total = await getTotalSessions();
    return { rows, total };
  } catch (err) {
    console.error("Failed to fetch recent sessions:", err);
    return { rows: [], total: 0 };
  }
});


app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
