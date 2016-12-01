'use strict';

const electron = require('electron');  
const app = electron.app;  
const BrowserWindow = electron.BrowserWindow;
var ipc = require('electron').ipcMain;
var MPD = require('node-mpd');
var mpd = new MPD({});
global.sharedObject = {"currentSongs" : []};
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
  mpd.on("ready", function() {
    console.log('ready');
    for(var num = 0; num < mpd.playlist.length; num++) {
      global.sharedObject.currentSongs.push({"pos": num, "fileName": mpd.playlist[num].file});
      //console.log(n + ": " + mpd.playlist[num].artist + " - " + mpd.playlist[num].title);
    }
  });

  mpd.on("update", function(status) {
    console.log("Update:", status);
    switch(status) {
      case "mixer":
      case "player":
      case "options":
        console.log("Status after update", mpd.status);
        break;
      case "playlist":
        console.log("Playlist after update", mpd.playlist);
        break;
      case "database":
        console.log("Songs after update", mpd.songs);
        break;
    }
  });
  //La Connection commence ici
  mpd.connect();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  //Evenements et interaction avec MPD
  ipc.on('next', function () {
    mpd.next();
  });

  ipc.on('prev', function () {
    mpd.prev();
  });

  ipc.on('pause', function () {
    mpd.pause();
  });

  ipc.on('play', function () {
    mpd.play();
  });

  ipc.on('stop', function () {
    mpd.stop();
  });

  ipc.on('playAt', function (event, data) {
    mpd.playAt(data.pos);
  });

  ipc.on('clear', function () {
    mpd.clear();
    mpd.updateStatus()
  });

});


