/* Directives */

var myApp = angular.module('insectIdentifierApp');

myApp.directive('fileModel', ['$parse', function ($parse) {
return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
			console.log("filemodel directive.");
        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });
    }
};
}]);

myApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

myApp.directive('header', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        templateUrl: "../partials/header.html",
        controller: ['$scope', '$filter', '$cookies', 'UserRestService', 'Auth', 'TranslationService', 
        		'$location','$route',
        		function ($scope, $filter,	$cookies, UserRestService, Auth, TranslationService, $location, $route) {
		    	console.log('header directive.');
		    	$scope.location=$location;
				$scope.lang=$cookies.get('lang');
				
		    	if (!$cookies.get('lang')) {
					console.log('no lang chosen.');
					$cookies.put('lang', 'en');	    	
		    	}

		    	TranslationService.getTranslation($scope, $cookies.get('lang'), '');
		    			    	
		    	UserRestService.requestCurrentUser(function (data) {
	      	 	console.log("header Ctrl user: "+JSON.stringify(data));
   	    		Auth.set(data);
   	    		$scope.currentUser = $cookies.get('current.user');
   	    			
   	    		console.log("scope.user: "+$scope.currentUser);
       		});
				
				$scope.setLanguage = function(lang) {
					 $cookies.put('lang', lang);
					 console.log('lang: '+lang);
					 TranslationService.getTranslation($scope, $cookies.get('lang'), '');
					 $scope.lang=lang;
				 	 $route.reload();																																																																																																																																																																																																																																																																																																												
				    		
				}
				  
        }]
    }
});

