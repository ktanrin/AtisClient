'use strict'

import { app ,Menu , protocol, BrowserWindow ,dialog, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const fs = require('fs');
const path = require('path');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 510,
    height: 850,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

let serverIp = 'localhost'; // Default or previously stored IP
//let ip;
let setupServerWin; // Reference to the setup server window

function showServerSetupDialog() {
  if (!setupServerWin) {
    setupServerWin = new BrowserWindow({
    width: 330,
    height: 150,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), 
    },
  });

  setupServerWin.on('closed', () => {
    setupServerWin = null;
  });
  setupServerWin.webContents.openDevTools();
  // setupServerWin.loadFile('..\\src\\server-setup-dialog.html');
  let dialogPath = isDevelopment
  ? `file://${path.join(__dirname, '..', 'public', 'server-setup-dialog.html')}`
  : `file://${path.join(process.resourcesPath, 'app.asar.unpacked', 'server-setup-dialog.html')}`;
  console.log('dialogPath', dialogPath);
  setupServerWin.loadURL(dialogPath);
  //setupServerWin.webContents.send('server-ip-updated', serverIp);
  // ipcMain.on('close-dialog', (event) => {
  //   if (setupServerWin) {
  //     setupServerWin.close();
  //     ipcMain.removeHandler('close-dialog'); // Remove the event handler
  //   }
  // });
  }
  else {
    setupServerWin.focus();
  }
}

ipcMain.on('server-ip-set', (event, ip) => {
  serverIp = ip;
  console.log('Server IP set to',serverIp); // Do something with the server IP
  //showServerSetupDialog();
  event.sender.send('server-ip-updated', serverIp);
  // Here you would store the IP and use it for your socket connection
  
});

ipcMain.handle('get-server-ip', async () => {
  console.log('get-server-ip',serverIp);
  return serverIp;
});




// Modify the menu template to include the 'Setup Server' label
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Setup Server',
        click: () => showServerSetupDialog()
      },
      {
        label: 'DevTools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
        if (focusedWindow) focusedWindow.toggleDevTools();
      }        
      },
      // ...other menu items...
    ]
  },
 


  // ...other top-level menu items...
];

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow();
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.handle('load-audio', async (event, fileName) => {
  // Construct the path to the audio file
  const filePath = path.join(app.getAppPath(), fileName);
 
  try {
    // Read the file as a buffer
    const audioBuffer = fs.readFileSync(filePath);
    // Return the buffer data
    return audioBuffer;
  } catch (error) {
    console.error('Error loading audio file:', error);
    throw error; // Propagate the error back to the renderer process
  }
 });
