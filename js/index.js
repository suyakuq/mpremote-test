/**
 * Created by marco on 01/12/16.
 */
'use strict';

var PLAYER = {
    modules: {},
    ipc : require('electron').ipcRenderer
};

PLAYER.modules.actions = (function(){

    return {
          prev: function () {
              PLAYER.ipc.send('prev');
          },
          next: function () {
              PLAYER.ipc.send('next');
          },
          play: function () {
              PLAYER.ipc.send('play');
          },
          pause: function () {
              PLAYER.ipc.send('pause');
          },
          stop: function () {
              PLAYER.ipc.send('stop');
          },
            clear: function () {
                PLAYER.ipc.send('clear');
            }
    };
})();

PLAYER.modules.playlist = (function () {
    var currentSongs = require('electron').remote.getGlobal('sharedObject').currentSongs;
    console.log(currentSongs);
    return{
        loadSongs: function () {
            var ul = $('#songList');
            for(var i = 0; i< currentSongs.length; i++){
                ul.append($('<li>'+currentSongs[i].fileName+'</li>').attr('id', currentSongs[i].pos));
            }
        },
        playSong: function(pos){
            console.log(pos);
            PLAYER.ipc.send('playAt',{'pos': pos});
        },
        initSongEvents: function () {
            $('#songList').on('click', 'li', function () {
                PLAYER.modules.playlist.playSong($(this).attr('id'));
            });
        }
    }
})();


PLAYER.modules.app = (function(){
    var actions = PLAYER.modules.actions;
    var playlist = PLAYER.modules.playlist;
    return{
        start : function () {
            playlist.loadSongs();
            $('#prev').click(actions.prev);
            $('#next').click(actions.next);
            $('#play').click(actions.play);
            $('#pause').click(actions.pause);
            $('#stop').click(actions.stop);
            $('#clear').click(actions.clear);
        }
    }

})();
$(document).ready(function(){
    PLAYER.modules.app.start();
    PLAYER.modules.playlist.initSongEvents();
});
