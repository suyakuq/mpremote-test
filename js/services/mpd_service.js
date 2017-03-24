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
        play: function (music) {
            return {title: 'Player', options: {body: 'Now playing: '+music}};
        }
    };


    var MPD = require('node-mpd');
    var rooms = [];
    var currentMPD;
    var inc = 0;
    var volume_interval = 10;
    return{
        //Return current mpd
        getPlayer:  function () {
            return currentMPD;
        },

        //return all mpds
        getRooms : function() {
            return rooms;
        },

        connect : function (host, port, callback) {
            rooms.push(new MPD({host: host, port : port}));
            rooms.forEach(function(mpd) {
                mpd.on('ready', function (status, server) {
                    //showAlert("Connecté à "+server.name+", host: "+mpd.host);
                    var notif = notifications.connection(server.name, mpd.host);
                    new Notification(notif.title, notif.options);
                    if(status.state =='play'){
                        var currentSong = mpd.playlist[mpd.status.song];
                        var playNotif = notifications.play(currentSong.artist+" - "+currentSong.title);
                        new Notification(playNotif.title, playNotif.options);
                    }
                    callback();
                });
                mpd.on('update', function (updated) {
                    if(updated == 'player' && mpd.status.state =='play'){
                        var currentSong = mpd.playlist[mpd.status.song];
                        var notif = notifications.play(currentSong.artist+" - "+currentSong.title);
                        var playNotif = new Notification(notif.title, notif.options);
                    }
                    $rootScope.$broadcast('onUpdate', {mpd: mpd, event: updated});
                });
                
                currentMPD = mpd;
                
            }, this);

            currentMPD.connect();
        },
        disconnect: function (player, callback) {
            player.disconnect();
            var notif = notifications.disconnection();
            var connectNotification = new Notification(notif.title, notif.options);
            currentMPD = null;
            callback();
        },
        addSongs : function () {
            currentMPD.updateSongs(function (songs) {
                console.log(songs);
            });
        },
        play : function () {
            currentMPD.play(function () {

            });
        },
        pause : function () {
            currentMPD.pause(function () {
            });
        },

        random: function () {
            currentMPD.random(currentMPD.status.random == 0 ? 1 : 0, function () {
            });
        },

        repeat: function () {
            currentMPD.repeat(currentMPD.status.repeat == 0 ? 1 : 0, function () {
                console.log(currentMPD.status);
            });
        },

        prev : function () {
            currentMPD.prev(function () {
               console.log("prev");
            });
        },
        next : function () {
            currentMPD.next(function () {
                console.log("next");
            })
        },
        stop: function () {
            currentMPD.stop();
        },
        clear : function () {
            currentMPD.clear(function () {
                console.log("clear");
            });
        },
        playAt: function (pos) {
            currentMPD.playAt(pos, function () {

            });
        },
        add: function (element) {
            currentMPD.add(element, function () {
               console.log(currentMPD.playlist);
            });
        },
        delete : function (element) {
                currentMPD.delete(element, function() {
                console.log(currentMPD.playlist);
            })
        },
        volPlus: function () {
            var newVolume = parseInt(currentMPD.status.volume) + volume_interval;
            if(newVolume <= 100) {
                currentMPD.volume(newVolume);
                currentMPD.updateStatus();
            }
        },
        volMinus: function () {
            var newVolume = parseInt(currentMPD.status.volume) - volume_interval;
            if (newVolume >= 0) {
                currentMPD.volume(newVolume);
                currentMPD.updateStatus();
            }
        },
        getAllSongs : function() {
            currentMPD.getSongs(function(data){
                $rootScope.$broadcast('onSongsReceived',data);
            });
        },
        getAlbums : function() {
            currentMPD.getList('album', function(data){
                $rootScope.$broadcast('onAlbumsReceived', data);
            });
        },
        getArtists : function() {
            currentMPD.getList('artist', function(data){
            $rootScope.$broadcast('onArtistsReceived', data);
            });
        },
        getGenres : function() {
            currentMPD.getList('genre', function(data){
                $rootScope.$broadcast('onGenresReceived', data);
            });
        },
        refrechSongs : function(search) {
            currentMPD.findRequest(search, function(data){
                $rootScope.$broadcast('onResonseFindRequest', data);
            });
        },
        getPlaylists : function() {
            currentMPD.listOfPlaylists(function(data){
                $rootScope.$broadcast('onPlaylistsReceived', data);
            });
        },
        getPlaylistsSongs : function(name) {
            currentMPD.playlistSongs(name, function(data){
                $rootScope.$broadcast('onPlaylistSongsReceived', data);
            })
        },
        addPlaylist : function(name) {
            currentMPD.newPlaylist(name, function(response){
                return response;
            });
        },
        removePlaylist : function(name) {
            currentMPD.removePlayList(name, function(response){
                return response;
            })
        },
        addSongToPlaylist : function(name, song) {
            currentMPD.addToPlaylist(name, song, function(response){
                return response;
            });
        },
        deleteSongFromPlaylist : function(name, song) {
            currentMPD.deleteFromPlaylist(name, song, function(response){
                return response;
            });
        },
        loadPlaylist : function(name) {
            currentMPD.loadPlaylist(name ,function(response){
                return response;
            });
        },
        status : function (callback) {
            currentMPD.updateStatus(callback);
        },
        seek: function (position, callback) {
            currentMPD.seek(position,callback);
        },
        setPlayer : function (player) {
            rooms.forEach(function(element) {
                if(element.$$hashKey == player.$$hashKey){
                    currentMPD = element;
                }
            });
        }
    }
};