/**
 * Created by marco on 01/12/16.
 */
'use strict';

var PLAYER = {
    modules: {},
    ipc : require('electron').ipcRenderer,
    remote : require('electron').remote,
    MPD : require('node-mpd')
};

PLAYER.modules.mpd = (function () {

    var mpd = new PLAYER.MPD({});
    mpd.on("ready", function () {
        PLAYER.modules.playlist.loadSongs(mpd.playlist);
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
            mpd.clear(function () {
                mpd._updatePlaylist(PLAYER.modules.playlist.loadSongs(mpd.playlist))
            } );
        },
        playAt: function (pos) {
                mpd.playAt(pos);
        },
        add: function () {
            mpd.add();
        }
    }
})();

PLAYER.modules.playlist = (function () {
    return{
        loadSongs: function (songs) {
            console.log("songs");
            console.log(songs);
            var ul = $('#songList');
            ul.empty();
            for(var i = 0; i< songs.length; i++){
                ul.append($('<li>'+songs[i].file+'</li>').attr('id', i));
            }
        },
        addFolder: function(name){
               // PLAYER.ipc.send('add',{'name':name});
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
        }
    }

})();
$(document).ready(function(){
    PLAYER.modules.mpd.init();
    PLAYER.modules.app.start();
    PLAYER.modules.playlist.initSongEvents();
});
