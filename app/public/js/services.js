'use strict';

/* Services */

var insectIdentifierServices = angular.module('insectIdentifierServices', ['ngResource']);

insectIdentifierServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('../phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);
  
insectIdentifierServices.factory('Insect', ['$resource',
  function($resource){
    return $resource('../phones/:categoryName.json', {}, {
      query: {method:'GET', params:{categoryName:'kovakuoriaiset'}, isArray:true}
    });
  }]);
insectIdentifierServices.factory('Search', function() {
 var savedData = {}
 
 function set(data) {
   savedData = data;
 }
 
 function get() {
  return savedData;
 }

 return {
  set: set,
  get: get
 }

});

insectIdentifierServices.factory('TranslationService', ['$resource', 'Search', function($resource, Search) {
		return {  
     		getTranslation: function($scope, language, page) {
         	var languageFilePath = 'translations/'+page + language + '.json';
         	$resource(languageFilePath).get(function (data) {
         		console.log('translation service');
         		var obj = Search.get();
         		obj.translations=data;
         		Search.set(obj);
         		if ($scope)
            		$scope.translations = data;
         	});
     		}
     	}
}]);

insectIdentifierApp.factory('UserRestService', ['$http', function($http) {
	return {
		requestCurrentUser: function(callback) {			
			$http.get("/currentUser").success(function(data) {
				console.log('UserRestService currentUser: '+JSON.stringify(data));
				callback(data);	
			}).error(function() {
				console.log('currentUser error.');
				callback(null);						
			});
		}
	}	
}]);

insectIdentifierApp.factory('Auth', ['$cookies', function ($cookies) {

        var _user = {};

        return {

            user : _user,

            set: function (user) {
                // you can retrive a user setted from another page, like login sucessful page.
                var existing_cookie_user = $cookies.get('current.user');
                console.log('Auth set user parameter: '+JSON.stringify(user));
                _user =  user || existing_cookie_user;
                console.log('Auth set _user: '+_user);
                $cookies.put('current.user', JSON.stringify(user));
            },

            remove: function () {
                $cookies.remove('current.user', _user);
            }
        };
    }]);