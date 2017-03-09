/**
 * Created by marco on 2/03/17.
 */
module.exports = function($rootScope, electron) {

    var showAlert = function (message) {
        electron.dialog.showMessageBox({
            title: 'Status',
            message: message
        });
    };


    var MPD = require('node-mpd');
    var mpd;
    var volume_interval = 10;
    return{

        getPlayer:  function () {
            return mpd;
        },

        connect : function (host, port) {
            mpd = new MPD({host: host, port : port});
            mpd.on('ready', function (status, server) {
                showAlert("Connecté à "+server.name+", host: "+mpd.host);
                $rootScope.$broadcast('onConnect',mpd);
            });
            mpd.on('update', function (updated) {
                $rootScope.$broadcast('onUpdate',mpd);
            });

            mpd.connect();

        },
        disconnect: function () {
            console.log("disconnected");
            mpd.disconnect();
            mpd.on('update', function () {
                $rootScope.$broadcast('onUpdate', false);
            });
        }
        ,

        addSongs : function () {
            mpd.updateSongs(function (songs) {
                console.log(songs);
            });
        },
        play : function () {
            console.log("play");
            mpd.play(function () {
                console.log("playing");
            })
        },
        pause : function () {
            mpd.pause(function () {
                console.log('paused');
            });
        },
        prev : function () {
            mpd.prev(function () {
               console.log("prev");
            });
        },
        next : function () {
            mpd.next(function () {
                console.log("next");
            })
        },
        stop: function () {
            mpd.stop(function () {
               console.log("stopped");
            });
        },
        clear : function () {
            mpd.clear(function () {
                console.log("clear");
            });
        },
        playAt: function (pos) {
            mpd.playAt(pos, function () {
                console.log("playing at");
            });
        },
        add: function (element) {
            mpd.add(element, function () {
               console.log("added");
            });
        },
        volPlus: function () {
            var newVolume = parseInt(mpd.status.volume) + volume_interval;
            if(newVolume <= 100) {
                mpd.volume(newVolume);
                mpd.updateStatus();
            }
        },
        volMinus: function () {
            var newVolume = parseInt(mpd.status.volume) - volume_interval;
            if (newVolume >= 0) {
                mpd.volume(newVolume);
                mpd.updateStatus();
            }
        }
    }
};