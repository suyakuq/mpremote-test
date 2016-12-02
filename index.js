'use strict';

const electron = require('electron');  
const app = electron.app;  
const BrowserWindow = electron.BrowserWindow;
//var MPD = require('node-mpd');
//var mpd = new MPD({});
//global.sharedObject = {};
let mainWindow;


app.on('window-all-closed', function() {  
  if(process.platform != 'darwin') {
    app.quit();
  }
});
app.on('ready', function() {  
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.openDevTools(); //F12 equivalent


  mainWindow.on('closed', function() {
    mainWindow = null;
  });

});


