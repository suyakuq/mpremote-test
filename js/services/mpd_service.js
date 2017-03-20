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

    var notifications = {
        connection :  function (serverName, host) {
            return {title: 'Connexion', options: {body: 'Connecté à ' + serverName + ", host: " + host}};
        },
        disconnection: function () {
            return {title: 'Déconnexion', options: {body: 'Déconnecté du serveur'}};
        },
        play: function () {
            return {title: 'Player', body: 'Playing'};
        }
    }





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
                //showAlert("Connecté à "+server.name+", host: "+mpd.host);
                var notif = notifications.connection(server.name, mpd.host);
                var connectNotification = new Notification(notif.title, notif.options);
                callback();
            });
            mpd.on('update', function (updated) {
                $rootScope.$broadcast('onUpdate', {mpd: mpd, event: updated});
            });

            mpd.connect();

        },
        disconnect: function (callback) {
            mpd.disconnect();
            var notif = notifications.disconnection();
            var connectNotification = new Notification(notif.title, notif.options);
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
        },
        getPlaylists : function() {
            mpd.listOfPlaylists(function(data){
                $rootScope.$broadcast('onPlaylistsReceived', data);
            });
        },
        getPlaylistsSongs : function(name) {
            mpd.playlistSongs(name, function(data){
                $rootScope.$broadcast('onPlaylistSongsReceived', data);
            })
        },
        addPlaylist : function(name) {
            mpd.newPlaylist(name, function(response){
                return response;
            });
        },
        removePlaylist : function(name) {
            mpd.removePlayList(name, function(response){
                return response;
            })
        },
        addSongToPlaylist : function(name, song) {
            mpd.addToPlaylist(name, song, function(response){
                return response;
            });
        },
        deleteSongFromPlaylist : function(name, song) {
            mpd.deleteFromPlaylist(name, song, function(response){
                return response;
            });
        },
        loadPlaylist : function(name) {
            mpd.loadPlaylist(name ,function(response){
                return response;
            });
        },
        status : function (callback) {
            mpd.updateStatus(callback);
        },
        seek: function (position, callback) {
            mpd.seek(position,callback);
        }
    }
};