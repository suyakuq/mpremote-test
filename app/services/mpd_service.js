/**
 * Created by marco on 2/03/17.
 */
module.exports = function($rootScope, electron, $timeout) {

    const filterEmpty = function (e) {
        return e && e!='';
    };

    const notifyMsg = function (type, data) {
      switch (type){
          case 'connect': new Notification('Connection', {body: 'Connecté à ' + data.serverName + ", host: " + data.host});break;
          case 'disconnect': new Notification('Déconnection', {body: 'Déconnecté du serveur '+data.host});break;
          case 'play': new Notification('Player', {body: 'Now playing: '+data.music+" on "+data.host});break;
      }
    };

    const stopCounter = function(player){
        //divide = pourcentage par rapport à la durée de la musique, pour le width du progress-bar
        player.divide = 0;
        $timeout.cancel(player.promiseTimeout);
        //$timeout.cancel(mytimeout);
    };

    const onTimeout = function(player){
        //divide = pourcentage par rapport à la durée de la musique, pour le width du progress-bar
        //counter = valeur, soit 0 soit le temps qui a passé en jouant la musique (on l'obtient et on le set de $scope.player.status.time.elapsed)

        if(player.timer.counter < player.timer.time){
            player.timer.counter++;
            player.promiseTimeout  = $timeout(function () {
                onTimeout(player);
            },1000);
        }
    };

    const checkStatus = function (player) {
        if(player.status.state =='play'){
            player.currentSong = player.playlist[player.status.song];
            notifyMsg('play', {music: player.currentSong.artist+" - "+player.currentSong.title, host: player.host});
            if((player.previousStatus.songId != -1 && player.previousStatus.songId != player.status.song) || player.previousStatus.state == 'stop') {
                stopCounter(player);
            }
            player.previousStatus.songId = player.status.song;
            onTimeout(player);
        }else if(player.status.state == 'pause'){
            stopCounter(player);
        }else if(player.status.state == 'stop'){
            console.log('stop');
            stopCounter(player);
        }
    };

    var MPD = require('node-mpd');
    var rooms = [];
    var inc = 0;
    const volume_interval = 10;
    return{
        //return all mpds
        getRooms : function() {
            return rooms;
        },
        connect : function (host, port, callback) {
            var mpd = new MPD({host: host, port : port});
            mpd.on('update', function (updated) {
                if(updated == 'player'){
                    this.timer.time = (this.status.time) ? this.status.time.length : 0;
                    this.timer.counter = (this.status.time) ? this.status.time.elapsed : 0;
                    checkStatus(this);
                }
                $rootScope.$broadcast('onUpdate', {mpd: this, event: updated});
            });
            mpd.on('ready', function (status, server) {
                //if everything is ok, we add this mpd to the rooms array
                this.timer = {
                    time: (this.status.time) ? this.status.time.length : 0,
                    counter: (this.status.time) ? this.status.time.elapsed : 0,
                    divide : function () {
                        return this.counter*100/this.time;
                    }
                };
                this.previousStatus = {state : this.status.state, songId: this.status.song || -1};
                rooms.push(this);
                notifyMsg('connect', {serverName: server.name, host: this.host});
                checkStatus(this);
                callback();
                mpd = undefined;
            });
            mpd.connect();
        },
        disconnect: function (player, callback) {
            var host = player.host;
            if(player.promiseTimeout)   $timeout.cancel(player.promiseTimeout);
            player.disconnect();
            var indextoDelete = rooms.indexOf(player);
            rooms.splice(indextoDelete,1);
            notifyMsg('disconnect', {host: host});
            callback(indextoDelete);
        },
        addSongs : function (player) {
            player.updateSongs(function (songs) {
                console.log(songs);
            });
        },
        play : function (player) {
            player.play(function () {

            });
        },
        pause : function (player) {
            player.pause(function () {
            });
        },

        random: function (player) {
            player.random(player.status.random == 0 ? 1 : 0, function () {
            });
        },

        repeat: function (player) {
            player.repeat(player.status.repeat == 0 ? 1 : 0, function () {
                console.log(player.status);
            });
        },

        prev : function (player) {
            player.prev(function () {
               console.log("prev");
            });
        },
        next : function (player) {
            player.next(function () {
                console.log("next");
            })
        },
        stop: function (player) {
            player.stop();
        },
        clear : function (player) {
            player.clear(function () {
                console.log("clear");
            });
        },
        playAt: function (player, pos) {
            player.playAt(pos, function () {

            });
        },
        add: function (player, element) {
            player.add(element, function () {
               console.log(player.playlist);
            });
        },
        delete : function (player, element) {
            player.delete(element, function() {
                console.log(player.playlist);
            })
        },
        volPlus: function (player) {
            var newVolume = parseInt(player.status.volume) + volume_interval;
            if(newVolume <= 100) {
                player.volume(newVolume);
                player.updateStatus();
            }
        },
        volMinus: function (player) {
            var newVolume = parseInt(player.status.volume) - volume_interval;
            if (newVolume >= 0) {
                player.volume(newVolume);
                player.updateStatus();
            }
        },
        queryLibraryByType: function (tabIndex, player, type) {
            if(type =='allSongs'){
                player.getSongs(function (data) {
                    $rootScope.$broadcast('onDataReceived', {type: type, items: data, tabIndex: tabIndex});
                });
            }else if(type =='playlist'){
                player.listOfPlaylists(function (data) {
                    data = data.filter(filterEmpty);
                    $rootScope.$broadcast('onDataReceived', {type: type, items: data, tabIndex: tabIndex});
                });
            }else{
                player.getList(type, function (data) {
                    data = data.filter(filterEmpty);
                    $rootScope.$broadcast('onDataReceived', {type: type, items: data, tabIndex: tabIndex});
                });
            }
        },
        searchSongs : function(tabIndex, player, type, search) {
            if(type == 'playlist'){
                player.playlistSongs(search, function(data){
                    $rootScope.$broadcast('onResponseFindRequest', {items: data, tabIndex: tabIndex});
                })
            }else{
                player.findRequest(type, search, function(data){
                    $rootScope.$broadcast('onResponseFindRequest', {items: data, tabIndex: tabIndex});
                });
            }

        },
        addPlaylist : function(tabIndex, player, name, callback) {
            player.newPlaylist(name, function(response){
                callback(response);
            });
        },
        removePlaylist : function(player, name) {
            player.removePlayList(name, function(response){
                return response;
            })
        },
        addSongToPlaylist : function(player, name, song) {
            player.addToPlaylist(name, song, function(response){
                return response;
            });
        },
        deleteSongFromPlaylist : function(player, name, song) {
            player.deleteFromPlaylist(name, song, function(response){
                return response;
            });
        },
        loadPlaylist : function(player, name) {
            player.loadPlaylist(name ,function(response){
                return response;
            });
        },
        status : function (player, callback) {
            player.updateStatus(callback);
        },
        seek: function (player, position, callback) {
            player.seek(position,callback);
        }/*,
        setPlayer : function (player) {
            rooms.forEach(function(element) {
                if(element.$$hashKey == player.$$hashKey){
                    currentMPD = element;
                }
            });
        }*/
    }
};