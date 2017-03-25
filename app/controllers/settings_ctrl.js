/**
 * Created by marco on 2/03/17.
 */
function settings_ctrl($scope, $rootScope, $location, MPDService) {
    $rootScope.showHome = true;
    //$scope.player = MPDService.getPlayer();
    $scope.tabs = [];
    $scope.rooms = MPDService.getRooms();
    console.log($scope.rooms);
    $scope.rooms.forEach(function(player,i) {
        $scope.tabs.push({
            id: i,
           title: player.host,
            player: player,
            static: false
        });
    });
    $scope.tabs.push({title: 'New (+)', static : true});
    $scope.servers = [];

    const defaultIp = '192.168.43.98';
    const defaultPort = 6600;

    $scope.connect = function (connectionParams) {
        var ip = (connectionParams && connectionParams.host) ? connectionParams.host : defaultIp;
        var port = (connectionParams && connectionParams.port) ? connectionParams.port : defaultPort;
        MPDService.connect(ip, port, function () {
            $scope.$apply(function () {
                $location.path('/');
            });
        });
    };

    $scope.disconnect = function (player) {
      MPDService.disconnect(player, function(indexToDelete){
          console.log(indexToDelete);
              $scope.rooms = MPDService.getRooms();
              $scope.tabs.splice(indexToDelete, 1);
      })
    };
}

module.exports = settings_ctrl;
