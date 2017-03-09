/**
 * Created by marco on 2/03/17.
 */
function settings_ctrl($scope, $location, MPDService) {

    $scope.player = MPDService.getPlayer();
    $scope.servers = [];

        $scope.$on('onConnect', function(event, data){
            $scope.player = data;
            $scope.isConnected = true;
            $location.path('/')
        });

        $scope.$on('onDisconnect', function(event, data){
            $scope.player = null;
            $scope.isConnected = false;
        });

        const defaultIp = '192.168.43.98';
        const defaultPort = 6600;

        $scope.connect = function (connectionParams) {
            var ip = (connectionParams && connectionParams.host) ? connectionParams.host : defaultIp;
            var port = (connectionParams && connectionParams.port) ? connectionParams.port : defaultPort;
            MPDService.connect(ip, port);
        };

        $scope.disconnect = function () {
          MPDService.disconnect();
        };
}

module.exports = settings_ctrl;