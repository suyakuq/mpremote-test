function library_ctrl($scope, MPDService) {

    MPDService.getAllSongs();

    MPDService.getAlbums();

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

    $scope.addToQueue = function(song){
        MPDService.add(song);
    }

}

module.exports = library_ctrl;