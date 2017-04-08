/**
 * Created by marco on 2/03/17.
 */
function settings_ctrl($scope, $rootScope, $location, MPDService) {
    var ipcRenderer = require('electron').ipcRenderer;

    ipcRenderer.send('getServers');
    ipcRenderer.on('retrieveServers', function (event, error, data) {
        if(!error){
                $scope.savedServers = data.servers;
        }else{
            console.log(error);
        }

    });
    $scope.onServerSelect = function (server) {
        if(server == null){
            $scope.player.host = "";
            $scope.player.port = "";
        }else{
            $scope.player.host = server.host;
            $scope.player.port = server.port;
            $scope.player.mustRemember = true;
        }
    };
    $rootScope.showHome = true;
    $scope.player = {mustRemember: false};
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
        MPDService.connect(connectionParams.host, connectionParams.port, function () {
            if(connectionParams.mustRemember){
                console.log('call main process');
                ipcRenderer.send('saveServer', {host: connectionParams.host, port: connectionParams.port});
            }else{
                console.log('call main process remove');
                ipcRenderer.send('removeServer', {host: connectionParams.host, port: connectionParams.port});
            }
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
