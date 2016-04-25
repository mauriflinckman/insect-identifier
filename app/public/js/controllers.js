'use strict';
//lets require/import the mongodb native drivers.
	//var mongodb = require('mongodb');
/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('InsectDetailCtrl', ['$scope', 'Search', '$location', '$http', '$localStorage',
	  function($scope, Search, $location, $http, $localStorage) {
			
  		// save the insect to the scope
  		$scope.prevUrl=Search.get().prevUrl;
		$scope.insect=Search.get().insect;
		console.log('prevUrl: '+$scope.prevUrl);
  		$("#selection").hide();
  		$scope.location=$location;
  	  		
  		//get the wiki description
  		
  		var wikilink="https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&"+
  			"explaintext=&titles="+$scope.insect.Wiki+'&callback=?';
  		$.getJSON(wikilink, function(data) {
  				var pages=data.query.pages;
    			for (var prop in pages) {
    				var description = JSON.stringify(data.query.pages[prop].extract);
    			}
				$scope.description=JSON.stringify(description);
  		});
  		
 		$scope.add_to_collection=function() {
 			if ($localStorage.collection) {
 				$localStorage.collection.push($scope.insect);
				// search matches
				for (var insect in $localStorage.collection) {
					if (insect.Name == $scope.insect.Name) {
						// remove duplicates
						$localStorage.collection.pop();
						break;					
					}
				
				} 			
 			} else {
				$localStorage.collection=[];
				$localStorage.collection.push($scope.insect); 
							
 			}
 			// save to the server
 			console.log('scope.insect.id: '+$scope.insect._id);
 			$http({
		   	url: '/collection/insert', 
    			method: "GET",
    			params: {insectId: $scope.insect._id}
 			}).success(function(data) {
				alert("item saved to the collection"); 			
 			});
 							
 		};
 	
		$scope.collection=function() {
			$scope.location.path('collection');
		};		
		$scope.new_search=function() {
 			$scope.location.path("search");
 			
		};
		
  }]);

phonecatControllers.controller('SearchCtrl', ['$scope', 'Search', '$location', '$http',
	  function($scope, Search, $location, $http) {
  		
  		$scope.location=$location;
 		$scope.search=function(query) {
 			console.log("query: "+query);
 			if (query =="" || typeof query == 'undefined') {
 				console.log("query is empty");
 				query = {};
 				query.primaryColor = "";
 				query.secondaryColor = "";
 				query.category = "";
 				query.legs = "";
 			}
 			Search.set(angular.copy(query));
 			
 			$scope.location.path('list');
		};
		
		
  }]);
  
  
  phonecatControllers.controller('ListCtrl', ['$scope', 'Search', '$http', '$location',
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
 		

  		
  		/*
  		$http.get('/insect/list').success(function(data) {
    		$scope.insects = data;
    		console.log(data);
    		var imgs=[];
  	   	// make a list of image urls
  			var len=data.length;
  			for (var i=0; i<len; i++) {
				imgs.push(data[i].image);  		
  			}
  			$scope.imgs = imgs;

  		});'*/
  		
	
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

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.query();
   
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;

      
    };
  }]);

phonecatControllers.controller('MainCtrl', ['$scope', 'Search', '$location', '$http',
	  function($scope, Search, $location, $http) {
	
	/*
	//We need to work with "MongoClient" interface in order to connect to a mongodb server.
	var MongoClient = mongodb.MongoClient;
	
	// Connection URL. This is where your mongodb server is running.
	var url = 'mongodb://localhost:27017/my_database_name';
	
	// Use connect method to connect to the Server
	MongoClient.connect(url, function (err, db) {
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  } else {
	    //HURRAY!! We are connected. :)
	    console.log('Connection established to', url);
	
	    // do some work here with the database.
	
	    //Close connection
	    db.close();
	  }
	});
	*/
  		$scope.location=$location;
  		
  		
  }]);
phonecatControllers.controller('CollectionCtrl', ['$scope', 'Search', '$location', '$http', '$localStorage',
	  	function($scope, Search, $location, $http, $localStorage) {

	  	//console.log('user.id: '+ req.user.id);
		if ($localStorage.collection == null) {	  	
				$localStorage.collection = [];
				
  		
		}
		$http.get('/collection/list').success(function(data) {
			// add items to the localstorage
			$localStorage.collection = data;
				    				
 				/*
 				var insects = data;
 				for (var collectionItem in $scope.collection) { 
				for (var insect in insects) {
					if (collectionItem.name==insect.name)
						collection.push(insect);
				}

			}	*/
 			
			//alert("collection: "+data);
		});
		
		
		
		$scope.location=$location;
		$scope.localStorage=$localStorage;
		$scope.viewDetail = function(insect) {
	   	var obj = {};
  	   	obj.insect = angular.copy(insect);
  	   	obj.prevUrl = "#/collection";
  	   	window.alert(obj);
  	   	Search.set(obj);
			$scope.location.path('insect');
		};
		
  		
  }]);