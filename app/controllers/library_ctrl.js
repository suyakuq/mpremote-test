function library_ctrl($scope, $rootScope, MPDService) {
    //$rootScope.showHome = true;
    //$rootScope.showLibrary = false;
    console.log('library');
    $scope.selectedSong;
    $scope.currentPlaylist;
    $scope.isPlaylist = false;

    $scope.selectSong = function(song){
        $scope.selectedSong = song;
    }

    MPDService.getAllSongs();
    MPDService.getAlbums();
    MPDService.getArtists();
    MPDService.getGenres();
    MPDService.getPlaylists();

    $scope.addPlaylist = function(name){
        MPDService.addPlaylist(name)
        $scope.playlists.push(name);
        $scope.playlist.name = "";
    };

    $scope.getPlaylistSongs = function(name){
        $scope.currentPlaylist = name;
        MPDService.getPlaylistsSongs(name);
    };

    $scope.addSongToPlaylist = function(name, song){
        MPDService.addSongToPlaylist(name, song);
    };

    $scope.deleteSongFromPlaylist = function(name, song){
        MPDService.deleteSongFromPlaylist(name, song);
        $scope.songs.splice($scope.songs.indexOf(song),1);
    };

    $scope.loadPlaylist = function(name){
        MPDService.clear();
        MPDService.loadPlaylist(name);
    };

    $scope.removePlaylist = function(name){
        MPDService.removePlaylist(name);
        $scope.playlists.splice($scope.playlists.indexOf(name),1);
    };

    $scope.refrechList = function(search){
        MPDService.refrechSongs(search);
    };

    $scope.$on('onSongsReceived', function(event, data){
        $scope.$apply(function(){
            $scope.songs = data;
            $scope.isPlaylist = false;
        });
    });
    $scope.$on('onAlbumsReceived', function(event, data){
        $scope.$apply(function(){
            $scope.albums = data;
        });
    });
    $scope.$on('onArtistsReceived', function(event, data){
        $scope.$apply(function(){
            $scope.artists = data;
        });
    });
    $scope.$on('onGenresReceived', function(event, data){
        $scope.$apply(function(){
            $scope.genres = data;
        });
    });
    $scope.$on('onResonseFindRequest', function(event, data){
        $scope.$apply(function(){
            $scope.songs = data;
            $scope.isPlaylist = false;
        });
    });
    $scope.$on('onPlaylistsReceived', function(event, data){
        $scope.$apply(function(){
            $scope.playlists = data;
        });
    });
    $scope.$on('onPlaylistSongsReceived', function(event, data){
        $scope.$apply(function(){
            $scope.songs = data;
            $scope.isPlaylist = true;
        });
    });

    $scope.$on('onSwitchServer', function(event, data){
        $scope.$apply(function(){
            console.log(data);
        });
    });

    $scope.addToQueue = function(song){
        MPDService.add(song);
    }

}

module.exports = library_ctrl;