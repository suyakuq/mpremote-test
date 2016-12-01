'use strict';

const electron = require('electron');  
const app = electron.app;  
const BrowserWindow = electron.BrowserWindow;
var ipc = require('electron').ipcMain;
var MPD = require('node-mpd');
var mpd = new MPD({});
let mainWindow;


app.on('window-all-closed', function() {  
  if(process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {  
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.openDevTools();
  mpd.on("ready", function() {
    //mpd.volume(80);
    console.log('ready');
    mpd.playlist.push(mpd.songs[1]);
    //mpd._updatePlaylist();
    for(var num = 0; num < mpd.playlist.length; num++) {
      var n = num + 1;
      console.log(n + ": " + mpd.playlist[num].artist + " - " + mpd.playlist[num].title);
    }
    //console.log(mpd);

   // mpd.play();
    console.log(mpd.status);
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
  mpd.connect();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

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
});


