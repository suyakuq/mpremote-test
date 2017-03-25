/**
 * Created by marco on 6/03/17.
 */
var angular = require("angular");
require('bootstrap-sass');
require('angular-ui-router');
require('angular-ui-bootstrap');
var app = angular.module('mpremote', ['ui.router', 'electangular', 'ui.bootstrap']);
app.config(['$stateProvider', '$urlRouterProvider', require('./config').router]);
app.service('MPDService', ['$rootScope', 'electron', '$timeout', require('./services/mpd_service')]);
app.controller('MainCtrl', ['$scope', '$rootScope', '$timeout', '$location', 'MPDService', require('./controllers/main_ctrl')]);
app.controller('SettingsCtrl', ['$scope', '$rootScope','$location', 'MPDService', require('./controllers/settings_ctrl')]);