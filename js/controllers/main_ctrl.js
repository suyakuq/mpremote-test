/**
 * Created by marco on 2/03/17.
 */
function main_ctrl($scope, MPDService) {

    $scope.player = MPDService.getPlayer();
    //$scope.player.currentSong = '';
    $scope.songTime = 0;
    var checkTimer = function (data) {
        if(data.event == 'player'){
            console.log(data.mpd);
            console.log($scope.player);
            var currentSong = $scope.player.status.song;
            $scope.$apply(function () {
                $scope.player.currentSong = {
                    name : $scope.player.playlist[currentSong].file,
                    time: $scope.player.playlist[currentSong].time
                };

            });
        }

    };
    //checkTimer();

    var stopTimer = function () {
        $scope.$broadcast('timer-stop');
    };

    $scope.$on('onConnect', function (event, data) {
        $scope.player = data;
        console.log("connected on main ctrl");
    });

    $scope.$on('onUpdate', function (event, data) {
        console.log(data.event);
        checkTimer(data);

    });

    $scope.$on('onDisconnect', function(event, data){
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

    $scope.next = function () {
        MPDService.next();
    };
    $scope.prev = function () {
        MPDService.prev();
    };
    $scope.stop = function () {
        MPDService.stop(stopTimer);
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
