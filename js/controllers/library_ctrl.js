function library_ctrl($scope, MPDService) {

    $scope.selectedSong;

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
        MPDService.getPlaylistsSongs(name, function(data){
            $scope.songs = data;
        });
    };

    $scope.addSongToPlaylist = function(name, song){
        MPDService.addSongToPlaylist(name, song, function(response){
            console.log(response);
        });
    }

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
        });
    });

    $scope.addToQueue = function(song){
        MPDService.add(song);
    }

}

module.exports = library_ctrl;