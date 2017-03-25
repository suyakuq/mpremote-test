/**
 * Created by marco on 2/03/17.
 */
function main_ctrl($scope, $rootScope, $timeout, $location, MPDService) {
    $rootScope.showHome = false;
    $scope.tabs = [];

    /**
     * Fonction qui s'éxecute quand le controller charge (après le chargement du DOM, voir $timeout)
     */

    $timeout(function () {
        $scope.rooms = MPDService.getRooms();
        $scope.rooms.forEach(function(player) {
            console.log(player);
            $scope.tabs.push({
                title: player.host,
                player: player
            });
        }, this);

        });

    $scope.seek = function (player, e) {
        //stopCounter();
        var fullProgressBarWidth = $(e.currentTarget).width();
        var requestedPosition = e.offsetX / fullProgressBarWidth;
        var seekTime = Math.ceil(player.timer.time*requestedPosition);
        MPDService.seek(player,seekTime);
    };

    $scope.addSongs = function (player) {
        MPDService.addSongs();
    };

    $scope.play = function (player) {
        MPDService.play(player);
    };

    $scope.pause = function (player) {
        MPDService.pause(player);
    };

    $scope.random = function (player) {
      MPDService.random(player);
    };

    $scope.repeat = function (player) {
        MPDService.repeat(player);
    };

    $scope.next = function (player) {
        MPDService.next(player);
    };
    $scope.prev = function (player) {
        MPDService.prev(player);
    };
    $scope.stop = function (player) {
        MPDService.stop(player);
    };
    $scope.clear = function (player) {
        MPDService.clear(player);
        MPDService._updatePlaylist(function () {
            //PLAYER.modules.playlist.loadSongs(mpd.playlist);
        });

    };
    $scope.playAt = function (player, pos) {
        MPDService.playAt(player, pos);
    };

    $scope.delete = function(player, position){
        MPDService.delete(player, position);
    }

    $scope.volPlus = function (player) {
        MPDService.volPlus(player);
    };
    $scope.volMinus = function (player) {
        MPDService.volMinus(player);
    };

    $scope.toLibrary = function(player) {
        console.log(player);
        $location.path('library');
    };

}

module.exports = main_ctrl;
