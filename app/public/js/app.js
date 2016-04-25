'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatAnimations',

  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices',
  'ngStorage'
  
]);
phonecatApp.config(['$locationProvider',
  	function ($locationProvider) {
  		 //$locationProvider.html5Mode(false).hashPrefix("!");
  		 
	}]);
phonecatApp.config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});
phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/phones', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl'
      }).
      when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
      when('/search', {
      	templateUrl: 'partials/search.html',
      	controller: 'SearchCtrl'
      }).
      when('/list', {
      	templateUrl: 'partials/list.html',
      	controller: 'ListCtrl'
      }).
      when('/insect', {
			templateUrl: 'partials/insect-detail.html',
			controller: 'InsectDetailCtrl'      
      }).
      when('/main', {
      		templateUrl: 'partials/main_menu.html',
      		controller: 'MainCtrl'
      }).
      when('/collection', {
      		templateUrl: 'partials/collection.html',
      		controller: 'CollectionCtrl'
      }).
      otherwise({
        redirectTo: '/phones'
      });
  }]);
