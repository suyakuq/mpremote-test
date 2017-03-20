'use strict';

const electron = require('electron');
const app = electron.app;
const path = require('path');
const url = require('url');
const BrowserWindow = electron.BrowserWindow;
//var MPD = require('node-mpd');
//var mpd = new MPD({});
//global.sharedObject = {};
let mainWindow;

function createWindow(){

    mainWindow = new BrowserWindow({width: 1600, height: 1200});
    mainWindow.setMenu(null);//hide menu
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.openDevTools(); //F12 equivalent


    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}
app.on('window-all-closed', function() {  
  if(process.platform != 'darwin') {
    app.quit();
  }
});
app.on('ready', createWindow);

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});


