/**
 * Created by marco on 2/03/17.
 */
function main_ctrl($scope, $timeout, MPDService) {

    //ici on va stocker la dernier musique jouée et la dernier action fait, pour pouvoir controller le pause, stop, et surtout le "next"
    //pour savoir quand redémarrer le timer
    var actualStatus = {actualSongId : -1};

    /**
     * Fonction qui s'éxecute quand le controller charge (après le chargement du DOM, voir $timeout)
     */
    $timeout(function () {
        $scope.player = MPDService.getPlayer();
        if($scope.player) {
            onPlayerChange();
        }
    });

    const stopCounter = function(){
        //divide = pourcentage par rapport à la durée de la musique, pour le width du progress-bar
        $scope.divide = $scope.counter*100/$scope.time;
        $timeout.cancel(mytimeout);
    };

    const onTimeout = function(){
        //divide = pourcentage par rapport à la durée de la musique, pour le width du progress-bar
        //counter = valeur, soit 0 soit le temps qui a passé en jouant la musique (on l'obtient et on le set de $scope.player.status.time.elapsed)
        if($scope.counter < $scope.time){
            $scope.counter++;
            $scope.divide = $scope.counter*100/$scope.time;
            mytimeout = $timeout(onTimeout,1000);
        }
    };

    const restart = function () {
        stopCounter();
        onTimeout();
    };

    var mytimeout = $timeout(onTimeout,1000);

    /**
     * Fonction qui écoute les évenements du player (play,stop,pause) Pour mettre à jour la vue
     */
    const onPlayerChange = function () {

        //Si lorsqu'on se connecte, le player est en "stop", on rédemarre le counter(nro de seconds passés)
        if($scope.player.status.state == 'stop'){
            actualStatus.state = $scope.player.status.state;
            actualStatus.actualSongId = $scope.player.status.song;
            $scope.counter = 0;
            stopCounter();
        }else{
            //Si lorsqu'on se connecte, le player est en "play" ou "pause" on mettre à jour le titre de la musique dans la vue
            // et on maj le temps qui avait passé
            var currentSong = $scope.player.playlist[$scope.player.status.song];
            $scope.$apply(function () {
                $scope.time = currentSong.time;
                $scope.counter = $scope.player.status.time.elapsed;
                $scope.player.currentSong = {name : currentSong.artist+ " - "+ currentSong.title
                }
            });
            if($scope.player.status.state == 'play'){
                //si actualSongId == -1 -> C'est nous qui commençons a jouer, alors on "commence"
                //du counter qu'on avaut, 0 si actualSongId == -1, le temps joué si on avait fait "pause"
                if(actualStatus.actualSongId == -1 || actualStatus.state == 'pause'){
                    onTimeout();
                }else{
                    //Si actualSongId != -1, qqn avait sélectionné "next", il faut rédemarrer le timer
                    restart();
                }
                actualStatus.state = $scope.player.status.state;
                actualStatus.actualSongId = $scope.player.status.song;
            }else if ($scope.player.status.state == 'pause') {
                actualStatus.state = $scope.player.status.state;
                actualStatus.actualSongId = $scope.player.status.song;
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
        $scope.counter= 0;
        stopCounter();
        $scope.player = null;
    });

    $scope.addSongs = function () {
        MPDService.addSongs();
    };

    $scope.play = function () {
        MPDService.play();
    };

    $scope.pause = function () {
        MPDService.pause();
    };

    $scope.random = function () {
      MPDService.random();
    };

    $scope.repeat = function () {
        MPDService.repeat();
    };

    $scope.next = function () {
        $scope.$broadcast('timer-stop');
        MPDService.next();
    };
    $scope.prev = function () {
        MPDService.prev();
    };
    $scope.stop = function () {
        MPDService.stop();
    };
    $scope.clear = function () {
        MPDService.clear();
        MPDService._updatePlaylist(function () {
            //PLAYER.modules.playlist.loadSongs(mpd.playlist);
        });

    };
    $scope.playAt = function (pos) {
        MPDService.playAt(pos);
    };

    //$scope add ne sert plus à rien
    $scope.add = function (name) {
        MPDService.add(name);
        MPDService._updatePlaylist(function () {
            //PLAYER.modules.playlist.loadSongs(mpd.playlist);
        });
    };

    $scope.delete = function(position){
        MPDService.delete(position);
    }

    $scope.volPlus = function () {
        console.log("plus");
        MPDService.volPlus();
    };
    $scope.volMinus = function () {
        MPDService.volMinus();
    };
}

module.exports = main_ctrl;
