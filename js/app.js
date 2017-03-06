/**
 * Created by marco on 6/03/17.
 */
var angular = require("angular");
require('bootstrap-sass');
require('angular-ui-router');
var app = angular.module('mpremote', ['ui.router', 'electangular']);
app.config(['$stateProvider', '$urlRouterProvider', require('./config').router]);
app.service('MPDService', ['$rootScope', 'electron', require('./services/mpd_service')]);
app.controller('MainCtrl', ['$scope', 'MPDService', require('./controllers/main_ctrl')]);
app.controller('SettingsCtrl', ['$scope', '$location', 'MPDService', require('./controllers/settings_ctrl')]);