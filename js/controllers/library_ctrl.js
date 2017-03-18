function library_ctrl($scope, MPDService) {

    MPDService.getAllSongs();
    MPDService.getAlbums();
    MPDService.getArtists();
    MPDService.getGenres();

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

    $scope.addToQueue = function(song){
        MPDService.add(song);
    }

}

module.exports = library_ctrl;