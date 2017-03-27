'use strict';

const electron = require('electron');
var {app, BrowserWindow, ipcMain} = electron;
const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');
let mainWindow;

//Communication between main windows an rendered process with eventa
ipcMain.on('saveServer', function(event, server) {
    storage.get('servers', function (error, data) {
        var exists = false;
            if(error)   throw error;
            if(Array.isArray(data)){
                for(var i = 0; i< data.length; i++){
                    if(data[i].host == server.host && data[i].port == server.port){
                        exists = true;
                    }
                }
                if(!exists) data.push(server);
            }
            else{
                data = [server];
            }
        storage.set('servers', data, function(error) {
            if (error) throw error;
        });
        });
});

ipcMain.on('removeServer', function(event, server) {
    storage.get('servers', function (error, data) {
        if(error)   throw error;
        if(Array.isArray(data)){
            var itemToDelete;
            for(var i = 0; i< data.length; i++){
                if(data[i].host == server.host && data[i].port == server.port){
                    itemToDelete = data[i];
                    break;
                }
            }
            data.splice(data.indexOf(itemToDelete), 1);
            storage.set('servers', data, function(error) {
                if (error) throw error;
            });
        }
        event.sender.send('retrieveServers', error, data);
    });
});

ipcMain.on('getServers', function (event) {
    storage.getAll(function (error, data) {
     event.sender.send('retrieveServers', error, data);
     });
});

function createWindow(){
    mainWindow = new BrowserWindow({width: 1600, height: 1200});
    mainWindow.setMenu(null);//hide menu
    //prevent dragging items in app
    mainWindow.webContents.on('will-navigate', function (e) {
        e.preventDefault()
    });
    //prevents opening a new window(eg. when middle-clicking)
    mainWindow.webContents.on('new-window', function (e) {
        e.preventDefault()
    });
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


