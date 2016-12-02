/**
 * Created by marco on 01/12/16.
 */
'use strict';

var PLAYER = {
    modules: {},
    remote : require('electron').remote,
    MPD : require('node-mpd')
};

PLAYER.modules.mpd = (function () {
    var volume_interval = 10;
    var mpd = new PLAYER.MPD({});
    mpd.on("ready", function () {
        PLAYER.modules.playlist.loadSongs(mpd.playlist);
        PLAYER.modules.playlist.showVolume(mpd.status.volume);
        console.log('ready');
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
    return {
        init: function () {
            mpd.connect();
        },
        play: function () {
            mpd.play();
        },
        pause: function () {
            mpd.pause();
        },
        next: function () {
            mpd.next();
        },
        prev: function () {
            mpd.prev();
        },
        stop: function () {
            mpd.stop();
        },
        clear: function () {
            mpd.clear();
            mpd._updatePlaylist(function () {
                   PLAYER.modules.playlist.loadSongs(mpd.playlist);
            });

        },
        playAt: function (pos) {
                mpd.playAt(pos);
        },
        add: function (name) {
            mpd.add(name);
            mpd._updatePlaylist(function () {
                PLAYER.modules.playlist.loadSongs(mpd.playlist);
            });
        },
        volPlus: function () {
            console.log("plus");
            mpd.volume(parseInt(mpd.status.volume) + volume_interval);
            mpd.updateStatus(function () {
                PLAYER.modules.playlist.showVolume(mpd.status.volume);
            });
        },
        volMinus: function () {
            mpd.volume(parseInt(mpd.status.volume) - volume_interval);
            mpd.updateStatus(function () {
                PLAYER.modules.playlist.showVolume(mpd.status.volume);
            });
        }
    }
})();

PLAYER.modules.playlist = (function () {
    return{
        loadSongs: function (songs) {
            if(songs) {
                var ul = $('#songList');
                ul.empty();
                for (var i = 0; i < songs.length; i++) {
                    ul.append($('<li>' + songs[i].file + '</li>').attr('id', i));
                }
            }
        },
        showVolume: function (volume) {
          $('#currentVol').text('Volume: '+volume);
        },
        addFolder: function(name){
            PLAYER.modules.mpd.add(name);
        },
        initSongEvents: function () {
            $('#songList').on('click', 'li', function () {
                PLAYER.modules.mpd.playAt($(this).attr('id'));
            });
            $('#add').on('click', function () {
                PLAYER.modules.playlist.addFolder($('#folder').val());
                PLAYER.modules.playlist.loadSongs();
            })
        }
    }
})();


PLAYER.modules.app = (function(){
    var mpd = PLAYER.modules.mpd;
    return{
        start : function () {
            $('#prev').click(mpd.prev);
            $('#next').click(mpd.next);
            $('#play').click(mpd.play);
            $('#pause').click(mpd.pause);
            $('#stop').click(mpd.stop);
            $('#clear').click(mpd.clear);
            $('#volPlus').click(mpd.volPlus);
            $('#volMinus').click(mpd.volMinus);
        }
    }

})();
$(document).ready(function(){
    PLAYER.modules.mpd.init();
    PLAYER.modules.app.start();
    PLAYER.modules.playlist.initSongEvents();
});
