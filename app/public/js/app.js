'use strict';

/* App Module */

var insectIdentifierApp = angular.module('insectIdentifierApp', [
  'ngRoute',
  'insectIdentifierAnimations',

  'insectIdentifierControllers',
  //'insectIdentifierFilters',
  'insectIdentifierServices',
  'ngStorage',
  'ngCookies'
  
]);
 

insectIdentifierApp.config(['$locationProvider',
  	function ($locationProvider) {
  		 //$locationProvider.html5Mode(false).hashPrefix("!");
  		 
	}]);
insectIdentifierApp.config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});
insectIdentifierApp.config(['$routeProvider',
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
      when('/insect/upload', {
      	templateUrl: 'partials/upload-insect.html',
      	controller: 'UploadInsectCtrl'
      }).
         otherwise({
        redirectTo: '/phones'
      });
  }]);
  
