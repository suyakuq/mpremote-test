/**
 * Created by marco on 2/03/17.
 */
function main_ctrl($scope, MPDService) {

    $scope.player = MPDService.getPlayer();
    var actualStatus = {};

    $scope.$on('onUpdate', function (event, data) {
        console.log(data.event);
        if(data.event == 'player'){
            if(data.mpd.status.state == 'play'){
                var currentSong = $scope.player.playlist[$scope.player.status.song];
                $scope.$apply(function () {
                    $scope.player.currentSong = {name : currentSong.artist+ " - "+ currentSong.title, time: moment().startOf('day')                            .seconds($scope.player.status.time.length)
                            .format('mm:ss')
                    }
                });
                if(actualStatus.actualSongId != data.mpd.status.song || actualStatus.state != 'pause'){
                    console.log('restart');
                    $scope.$broadcast('timer-start');
                }else{
                    console.log('resume');
                    $scope.$broadcast('timer-resume');
                }
                actualStatus.state = data.mpd.status.state;
                actualStatus.actualSongId = data.mpd.status.song;
            }else {
                actualStatus.state = data.mpd.status.state;
                actualStatus.actualSongId = data.mpd.status.song;
                if (data.mpd.status.state == 'stop') {
                    $scope.$broadcast('timer-stop');
                } else if (data.mpd.status.state == 'pause') {
                    $scope.$broadcast('timer-stop');
                }
            }
        }else if(data.event == 'options'){
            $scope.$apply(function () {
               $scope.player.status = data.mpd.status;
            });
        }
    });

    $scope.$on('onDisconnect', function(event, data){
        $scope.$broadcast('timer-clear');
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
