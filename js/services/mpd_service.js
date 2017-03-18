/**
 * Created by marco on 2/03/17.
 */
module.exports = function($rootScope, electron) {

    var showAlert = function (message) {
        electron.dialog.showMessageBox({
            title: 'Message',
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

        connect : function (host, port, callback) {
            mpd = new MPD({host: host, port : port});
            mpd.on('ready', function (status, server) {
                showAlert("Connecté à "+server.name+", host: "+mpd.host);
                callback(mpd);
            });
            mpd.on('update', function (updated) {
                $rootScope.$broadcast('onUpdate', {mpd: mpd, event: updated});
            });

            mpd.connect();

        },
        disconnect: function (callback) {
            mpd.disconnect();
            mpd = null;
            callback();
        }
        ,

        addSongs : function () {
            mpd.updateSongs(function (songs) {
                console.log(songs);
            });
        },
        play : function () {
            mpd.play(function () {

            });
        },
        pause : function () {
            mpd.pause(function () {
            });
        },

        random: function () {
            mpd.random(mpd.status.random == 0 ? 1 : 0, function () {
            });
        },

        repeat: function () {
            mpd.repeat(mpd.status.repeat == 0 ? 1 : 0, function () {
                console.log(mpd.status);
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
            mpd.stop();
        },
        clear : function () {
            mpd.clear(function () {
                console.log("clear");
            });
        },
        playAt: function (pos) {
            mpd.playAt(pos, function () {

            });
        },
        add: function (element) {
            mpd.add(element, function () {
               console.log(mpd.playlist);
            });
        },
        delete : function (element) {
            mpd.delete(element, function() {
                console.log(mpd.playlist);
            })
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
        },
        getAllSongs : function() {
            mpd.getSongs(function(data){
                $rootScope.$broadcast('onSongsReceived',data);
            });
        },
        getAlbums : function() {
            mpd.getList('album', function(data){
                $rootScope.$broadcast('onAlbumsReceived', data);
            });
        },
        getArtists : function() {
            mpd.getList('artist', function(data){
            $rootScope.$broadcast('onArtistsReceived', data);
            });
        },
        getGenres : function() {
            mpd.getList('genre', function(data){
                $rootScope.$broadcast('onGenresReceived', data);
            });
        },
        refrechSongs : function(search) {
            mpd.findRequest(search, function(data){
                $rootScope.$broadcast('onResonseFindRequest', data);
            });
        }
    }
};