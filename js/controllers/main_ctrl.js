/**
 * Created by marco on 2/03/17.
 */
function main_ctrl($scope, $timeout, $location, MPDService) {


    $scope.rooms = MPDService.getRooms();   
    
    $scope.rooms.forEach(function(player) {
        player.counter = (player.status.time) ? player.status.time.elapsed : 0;
        player.time = (player.status.time) ? player.status.time.length : 0;
        player.timeout = 0;
    }, this);


    //ici on va stocker la dernier musique jouée et la dernier action fait, pour pouvoir controller le pause, stop, et surtout le "next"
    //pour savoir quand redémarrer le timer
    var actualStatus = {actualSongId : -1};

    /**
     * Fonction qui s'éxecute quand le controller charge (après le chargement du DOM, voir $timeout)
     */
    
    $timeout(function () {
        $scope.player = MPDService.getPlayer();
        if($scope.player) {
            MPDService.status(function (status, server) {
                onPlayerChange(status);
            });

        }
    });

    const stopCounter = function(){
        //divide = pourcentage par rapport à la durée de la musique, pour le width du progress-bar
        $scope.player.divide = $scope.player.counter*100/$scope.player.time;
        $timeout.cancel($scope.player.timeout);
        //$timeout.cancel(mytimeout);
    };

    const onTimeout = function(){
        //divide = pourcentage par rapport à la durée de la musique, pour le width du progress-bar
        //counter = valeur, soit 0 soit le temps qui a passé en jouant la musique (on l'obtient et on le set de $scope.player.status.time.elapsed)
        if($scope.player.counter < $scope.player.time){
            $scope.player.counter++;
            $scope.player.divide = $scope.player.counter*100/$scope.player.time;
            $scope.player.timeout = $timeout(onTimeout,1000);
            //mytimeout = $timeout(onTimeout,1000);
        }
    };
    
    //var mytimeout = $timeout(onTimeout,1000);

    const restart = function () {
        stopCounter();
        onTimeout();
    };


    $scope.seek = function (player, e) {
        MPDService.setPlayer(player);
        $scope.rooms.forEach(function(p) {
            if(player.$$hashkey == p.$$hashkey){
                $scope.player = p;
            }
        }, this);
        stopCounter();
        var fullProgressBarWidth = $(e.currentTarget).width();
        var requestedPosition = e.offsetX / fullProgressBarWidth;
        var seekTime = Math.ceil($scope.player.time*requestedPosition);
        MPDService.seek(seekTime);
    };

    /**
     * Fonction qui écoute les évenements du player (play,stop,pause) Pour mettre à jour la vue
     */
    const onPlayerChange = function (playerStatus) {

        //Si lorsqu'on se connecte, le player est en "stop", on rédemarre le counter(nro de seconds passés)
        if(!playerStatus)   playerStatus = $scope.player.status;

        if(playerStatus.state == 'stop'){
            actualStatus.state = playerStatus.state;
            actualStatus.actualSongId = playerStatus.song;
            $scope.player.counter = 0;
            stopCounter();
        }else{
            //Si lorsqu'on se connecte, le player est en "play" ou "pause" on mettre à jour le titre de la musique dans la vue
            // et on maj le temps qui avait passé
            var currentSong = $scope.player.playlist[playerStatus.song];
            var elapsed = 0;
            if(playerStatus.time !== undefined){
                elapsed = playerStatus.time.elapsed;
            }
            $scope.$apply(function () {
                $scope.player.time = currentSong.time;
                //$scope.time = currentSong.time;
                $scope.player.counter = elapsed;
                $scope.player.currentSong = {name : currentSong.artist+ " - "+ currentSong.title
                }
            });
            if(playerStatus.state == 'play'){
                //si actualSongId == -1 -> C'est nous qui commençons a jouer, alors on "commence"
                //du counter qu'on avaut, 0 si actualSongId == -1, le temps joué si on avait fait "pause"
                if(actualStatus.state == 'pause'){
                    onTimeout();
                }else{
                    //Si actualSongId != -1, qqn avait sélectionné "next", il faut rédemarrer le timer");
                    restart();
                }
                actualStatus.state = playerStatus.state;
                actualStatus.actualSongId = playerStatus.song;
            }else if (playerStatus.state == 'pause') {
                actualStatus.state = playerStatus.state;
                actualStatus.actualSongId = playerStatus.song;
                stopCounter(true);
            }
        }
    };

    /**
     * Cette événement est appellé depuis le service quand qq condition a changé depuis le serveur mpd
     * si player -> c'est play/pause/stop, etc
     * si mixer -> c'est le volume
     * si options-> c'est repeat/random ou un autre
     */
    $scope.$on('onUpdate', function (event, data) {
        console.log(data.event);
        if(data.event == 'player'){
            onPlayerChange();
        }else if(data.event == 'options'){
            //on met à jout le status pour montrer si on a sélectionné random/repeat
            $scope.$apply(function () {
               $scope.player.status = data.mpd.status;
            });
        }
    });

    $scope.$on('onDisconnect', function(event, data){
        $scope.player.counter= 0;
        stopCounter();
        $scope.player = null;
    });

    $scope.addSongs = function (player) {
        MPDService.setPlayer(player);
        MPDService.addSongs();
    };

    $scope.play = function (player) {
        MPDService.setPlayer(player);
        MPDService.play();
    };

    $scope.pause = function (player) {
        MPDService.setPlayer(player);
        MPDService.pause();
    };

    $scope.random = function (player) {
        MPDService.setPlayer(player);
      MPDService.random();
    };

    $scope.repeat = function (player) {
        MPDService.setPlayer(player);
        MPDService.repeat();
    };

    $scope.next = function (player) {
        MPDService.setPlayer(player);
        $scope.$broadcast('timer-stop');
        MPDService.next();
    };
    $scope.prev = function (player) {
        MPDService.setPlayer(player);
        MPDService.prev();
    };
    $scope.stop = function (player) {
        MPDService.setPlayer(player);
        MPDService.stop();
    };
    $scope.clear = function (player) {
        MPDService.setPlayer(player);
        MPDService.clear();
        MPDService._updatePlaylist(function () {
            //PLAYER.modules.playlist.loadSongs(mpd.playlist);
        });

    };
    $scope.playAt = function (player, pos) {
        MPDService.setPlayer(player);
        MPDService.playAt(pos);
    };

    //$scope add ne sert plus à rien
    $scope.add = function (player, name) {
        MPDService.setPlayer(player);
        MPDService.add(name);
        MPDService._updatePlaylist(function () {
            //PLAYER.modules.playlist.loadSongs(mpd.playlist);
        });
    };

    $scope.delete = function(player, position){
        MPDService.setPlayer(player);
        MPDService.delete(position);
    }

    $scope.volPlus = function (player) {
        MPDService.setPlayer(player);
        console.log("plus");
        MPDService.volPlus();
    };
    $scope.volMinus = function (player) {
        MPDService.setPlayer(player);
        MPDService.volMinus();
    };

    $scope.toLibrary = function(player) {
        MPDService.setPlayer(player);
        console.log(player);
        $location.path('library');
    };

}

module.exports = main_ctrl;
