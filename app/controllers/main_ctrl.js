/**
 * Created by marco on 2/03/17.
 */
function main_ctrl($scope, $rootScope, $timeout, $location, MPDService) {
    $rootScope.showHome = false;
    const categories = ['playlist','artist','genre','album', 'allSongs'];

    $scope.tabs = [];

    /**
     * Fonction qui s'éxecute quand le controller charge (après le chargement du DOM, voir $timeout)
     */

    $timeout(function () {
        $scope.rooms = MPDService.getRooms();
        $scope.rooms.forEach(function(player) {
            $scope.tabs.push({
                title: player.host,
                player: player,
                library: { open: false, genres: [], artists : [], playlists: [], albums: [], allSongs: []}
            });
        }, this);

    });
    $scope.openLibrary=function(tabIndex, player){
        var library = $scope.tabs[tabIndex].library;
        categories.forEach(function (e) {
            MPDService.queryLibraryByType(tabIndex, player, e);
        });
        library.open = !library.open;
        console.log($scope.tabs[tabIndex].library.open);
    };

    $scope.searchSongs = function(tabIndex, player, type, criteria){
        MPDService.searchSongs(tabIndex, player, type, criteria);
    };

    $scope.addPlaylist = function(tabIndex, player, name){
        MPDService.addPlaylist(tabIndex, player, name, function (response) {
            if(response){
                $scope.tabs[tabIndex].library.playlists.push(response);
            }
        });
    };

    $scope.$on('onDataReceived', function (event, data) {
        var updateList;
        var tab = $scope.tabs[data.tabIndex];
        switch(data.type){
            case 'artist': updateList = function () {
                tab.library.artists = data.items;
            };break;
            case 'album': updateList= function () {
                tab.library.albums = data.items;
            };break;
            case 'genre': updateList = function () {
                tab.library.genres = data.items;
            };break;
            case 'playlist': updateList = function () {
                tab.library.playlists = data.items;
            };break;
            default: updateList = function () {
                tab.library.allSongs = data.items;
            }
        }
        $scope.$apply(updateList);
    });

    $scope.$on('onResponseFindRequest', function(event, data){
        var tab = $scope.tabs[data.tabIndex];
        tab.library.allSongs = [];
        if(tab){
            $scope.$apply(function(){
                tab.library.allSongs = data.items;
            });
        }
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
