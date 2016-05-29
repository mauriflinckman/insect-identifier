'use strict';
//lets require/import the mongodb native drivers.
	//var mongodb = require('mongodb');
/* Controllers */

var insectIdentifierControllers = angular.module('insectIdentifierControllers', []);

insectIdentifierControllers.controller('UploadInsectCtrl', ['$scope', 'Search', '$location', '$http', '$localStorage',
	  function($scope, Search, $location, $http, $localStorage) {
	  		// create a blank object to handle form data.
      
			$scope.uploadFile = function(){
			
			     var file = $scope.myFile;
			     var uploadUrl = "/insect/insert";
			     var fd = new FormData();
			     console.log("file: "+file);
			     fd.append('userPhotos', userPhotos);
				  fd.append('name', name);
					fd.append('latinName', latinName);
					fd.append('imageLinks', imageLinks);
					fd.append('category', category);
					fd.append('legs', legs);
					fd.append('wiki', wiki);
					fd.append('primaryColor', primaryColor);
					fd.append('secondaryColor', secondaryColor);		
			     $http.post(uploadUrl,fd, {
			         transformRequest: angular.identity,
			         headers: {'Content-Type': undefined}
			     })
			     .success(function(){
			       console.log("success!!");
			       $scope.location.path("#/main");
			     })
			     .error(function(){
			     		window.alert("File upload failed.");
			       console.log("error!!");
			     });
			 };      
      
   
	  }
]);

insectIdentifierControllers.controller('InsectDetailCtrl', ['$scope', 'Search', '$location', '$http', 
	'$localStorage', '$cookies',
	  function($scope, Search, $location, $http, $localStorage, $cookies) {
			
	  		// save the insect to the scope
	  		$scope.prevUrl=Search.get().prevUrl;
			$scope.insect=Search.get().insect;
			console.log('prevUrl: '+$scope.prevUrl);
	  		$("#selection").hide();
	  		$scope.location=$location;
	  	  		
	  		//get the wiki description
	  		var wikilink="https://"+$cookies.get("lang")+".wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&"+
	  			"explaintext=&titles="+$scope.insect.wiki+'&callback=?';
	  		$.getJSON(wikilink, function(data) {
	  				var pages=data.query.pages;
	    			for (var prop in pages) {
	    				var description = JSON.stringify(data.query.pages[prop].extract);
	    			}
					$scope.description=JSON.stringify(description);
	  		});
	  		var insect = $scope.insect;
 			$scope.mainImageUrl = insect.images[0];
 				 						
			$scope.setImage = function(img) {		
				$scope.mainImageUrl=img;					  			
	    	};
	  		
	 		$scope.add_to_collection=function() {
				var insectsByCategory = {'Ant': [], 'Beetle':[], 'Butterfly': [], 'Caterpillar': [], 'Spider': []};
				var duplicate = 0;
	 			if ($localStorage.collection) {
	 				if ($localStorage.collection[$scope.insect.category].length > 0) {
		 						 				
		 				var duplicate = 0;
						// search matches
						
						var t = $localStorage.collection[$scope.insect.category];
						console.log(t.length);
						console.log(t[0].name);
						for (var i = 0; i < t.length; i++) {
							var lsInsect = t[i];
							console.log(lsInsect.name);
							
							if (lsInsect.name == $scope.insect.name) {
								console.log("found duplicate between localstorage and server data");
								// found duplicate
								duplicate = true;																					
							}
							
						}				
						if (!duplicate)	
							$localStorage.collection[$scope.insect.category].push($scope.insect);
					}
					else {
						$localStorage.collection[$scope.insect.category].push($scope.insect);											
					} 
						 			
				}
	 			else {
					$localStorage.collection=[];
					$localStorage.collection = nsectsByCategory;
					$localStorage.collection[$scope.insect.category].push($scope.insect); 
								
	 			}
	 			// save to the server
	 			if (!duplicate) {
		 			$http({
				   	url: '/collection/insert', 
		    			method: "GET",
		    			params: {insectId: $scope.insect._id}
		 			}).success(function(data) {
						alert("item saved to the collection"); 			
		 			});
				} else 
					alert ("item already in collection");
	 	 			
	 	 							
	 		};
	 	
			$scope.collection=function() {
				$scope.location.path('collection');
			};		
			$scope.new_search=function() {
	 			$scope.location.path("search");
	 			
			};		
  }]);

insectIdentifierControllers.controller('SearchCtrl', ['$scope', 'Search', '$location', '$http',
	  function($scope, Search, $location, $http) {
	  		$("#results").hide();
	  		$scope.location=$location;
	 		
	 		$scope.search = function(query) {
	 			console.log("query: "+query);
				
			 			
	 			if (query =="" || typeof query == 'undefined') {
	 				console.log("query is empty");
	 				query = {};
	 				query.primaryColor = "";
	 				query.secondaryColor = "";
	 				query.category = "";
	 				query.legs = "";
	 			}
	 					 			
				// get a list of beetles
		  		$http({
			   	url: '/insect/search', 
		 			method: "GET",
		 			params: {primaryColor: query.primaryColor, secondaryColor: query.secondaryColor, 
		 				category: query.category, legs: query.legs }
		 		}).success(function (data) {
		 			
		 			console.log("receiving search results.")
		 			$scope.mainImageUrl = "not-available";
		 			$scope.insect=data[0];
		 			$scope.insects = data;
		 			var imgs=[];
		  	   	// make a list of image urls
		  			var len=data.length;
		  			for (var i=0; i<len; i++) {
						imgs.push(data[i].images[0]);  		
		  			}
		  			$scope.imgs = imgs;
		  			console.log("showing search results");
		  			if (data.length > 0)
		  				$scope.searchResults="showResults";	
		  			else 
		  				$scope.searchResults="noResults";				 			
		 		}); 					
			};
	  	   $scope.setImage = function(insect) {
				
				$scope.mainImageUrl=insect.images[0];
				$scope.insect=insect;
	    	};
	  	   $scope.insectDetail = function() {
	  	   	var obj = {};
	  	   	obj.insect = angular.copy($scope.insect);
	  	   	obj.prevUrl = "#/list";
	  	   	
	  	   	Search.set(obj);
				$scope.location.path('insect');
	    	};
}]);
  
  
  insectIdentifierControllers.controller('ListCtrl', ['$scope', 'Search', '$http', '$location',
  function($scope, Search, $http, $location) {

	
  		// save the search filter properties to the scope
  		var query = Search.get();
  		$scope.searchParams = query;
  		$scope.location=$location;
  		
  		// get a list of beetles
  		$http({
		   	url: '/insect/search', 
    			method: "GET",
    			params: {primaryColor: query.primaryColor, secondaryColor: query.secondaryColor, 
    				category: query.category, legs: query.legs }
 		}).success(function (data) {
 			 $scope.mainImageUrl = "not-available";
 			$scope.insects = data;
 			var imgs=[];
  	   	// make a list of image urls
  			var len=data.length;
  			for (var i=0; i<len; i++) {
				imgs.push(data[i].image);  		
  			}
  			$scope.imgs = imgs;
 			
 		});
 		
  	   $scope.setImage = function(insect) {
			
			$scope.mainImageUrl=insect.image;
			$scope.insect=insect;
  			$("#identify").prop('disabled', false);
    	};
  	   $scope.insectDetail = function() {
  	   	var obj = {};
  	   	obj.insect = angular.copy($scope.insect);
  	   	obj.prevUrl = "#/list";
  	   	
  	   	Search.set(obj);
			$scope.location.path('insect');
    	};
  }]);

insectIdentifierControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.query();
   
    $scope.orderProp = 'age';
  }]);

insectIdentifierControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;      
    };
  }]);

insectIdentifierControllers.controller('MainCtrl', ['$scope', 'Search', '$location', '$http', '$cookies', 
	'TranslationService', function($scope, Search, $location, $http, $cookies, TranslationService) {
 			$scope.location=$location;
			var lang =	$cookies.get('lang');
			var page = 'main';
			//a$scope.insect=Search.get().insect;
			
			//$scope.translations = Search.get().translations;
			//alert($scope.translations);  				
  			//alert('path: '+$scope.location.path());
			//TranslationService.getTranslation($scope, lang, '');  		
  		
  }]);
  
insectIdentifierControllers.controller('CollectionCtrl', ['$scope', 'Search', '$location', '$http', '$localStorage',
	function($scope, Search, $location, $http, $localStorage) {

		$scope.categories = {'Ant': 0, 'Beetle':0, 'Butterfly': 0, 'Caterpillar': 0, 'Spider': 0};
		$scope.insectsByCategory = {'Ant': [], 'Beetle':[], 'Butterfly': [], 'Caterpillar': [], 'Spider': []};	
	  	//console.log('user.id: '+ req.user.id);
		if ($localStorage.collection ==  null) {	  	
				$localStorage.collection = $scope.insectsByCategory;
		}
		console.log()
		$http.get('/collection/list').success(function(data) {
			// add items to the localstorage by category
			
			for (var ind in data) {
				var insect = data[ind];
				console.log($scope.categories[insect.category]);
				$scope.categories[insect.category] = '1';
				$scope.insectsByCategory[insect.category].push(insect);
				console.log(insect.category);
				var cat = insect.category;
				console.log($localStorage.collection[insect.category]);
				
				var duplicate  = 0;
				console.log("localStorage: "+JSON.stringify($localStorage));
				var t = $localStorage.collection[insect.category];
				console.log(t.length);
				console.log(t[0].name);
				for (var i = 0; i < t.length; i++) {
					var lsInsect = t[i];
					console.log(lsInsect.name);
					
					if (lsInsect.name == insect.name) {
						console.log("found duplicate between localstorage and server data");
						// found duplicate
						duplicate = true;																					
					}
					
				}				
				if (!duplicate)	
					$localStorage.collection[insect.category].push(insect);
			}			
			console.log($scope.categories);
			console.log(JSON.stringify($localStorage.collection['Butterfly']));
				    				
		}).error(function(){
			window.alert("Refreshing insect collection failed.");		   
		});		
		
		$scope.location=$location;
		$scope.localStorage=$localStorage;
		$scope.viewDetail = function(insect) {
	   	var obj = {};
  	   	obj.insect = angular.copy(insect);
  	   	obj.prevUrl = "#/collection";
  	   	Search.set(obj);
			$scope.location.path('insect');
		};
		
  		
  }]);