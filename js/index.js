/**
 * Created by marco on 01/12/16.
 */
'use strict';

var PLAYER = {
    modules: {}
};

PLAYER.modules.actions = (function(){
    var ipc = require('electron').ipcRenderer;
    return {
          prev: function () {
              ipc.send('prev');
          },
          next: function () {
              ipc.send('next');
          },
          play: function () {
              ipc.send('play');
          },
          pause: function () {
              ipc.send('pause');
          },
          stop: function () {
              ipc.send('stop');
          }
    };
})();


PLAYER.modules.app = (function(){
    var prev, next, play, pause, stop;
    var actions = PLAYER.modules.actions;

    return{
        start : function () {
            prev = document.getElementById('prev');
            next = document.getElementById('next');
            play = document.getElementById('play');
            pause = document.getElementById('pause');
            stop = document.getElementById('stop');

            prev.onclick = function () {
                actions.prev();
            };
            next.onclick = function () {
                actions.next();
            };
            play.onclick = function () {
                actions.play();
            };
            pause.onclick = function () {
                actions.pause();
            };
            stop.onclick = function () {
                actions.stop();
            }
        }
    }

})();

window.onload = PLAYER.modules.app.start;
