const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');


contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    // on: (channel, callback) => {
    //     ipcRenderer.on(channel, (event, ...args) => callback(...args));
    // },
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    },
    invoke: (channel, ...args) => {
        return ipcRenderer.invoke(channel, ...args);
    },
    getAppPath: () => {
        ipcRenderer.invoke('get-app-path')
    },
    on: (channel, func) => {
        let validChannels = ['server-ip-updated']; // Add all valid channels you want to listen to
        if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender`
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    sendServerIp: (ip) => {
        ipcRenderer.send('server-ip-set', ip);
    },
    onServerIpSet: (func) => {
        ipcRenderer.on('server-ip-set', (event, ...args) => func(...args));
    },
    requestCloseDialog: () => ipcRenderer.send('close-dialog'),
    getServerIp: () => ipcRenderer.invoke('get-server-ip'),
    loadAudio: (fileName) => ipcRenderer.invoke('load-audio', fileName)
});
