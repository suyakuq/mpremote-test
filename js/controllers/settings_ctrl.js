/**
 * Created by marco on 2/03/17.
 */
function settings_ctrl($scope, $location, MPDService) {

    $scope.player = MPDService.getPlayer();
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

    $scope.disconnect = function () {
      MPDService.disconnect(function () {
          $scope.player = null;
          $scope.isConnected = false;
      });
    };
}

module.exports = settings_ctrl;
