'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('../phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);
  
phonecatServices.factory('Insect', ['$resource',
  function($resource){
    return $resource('../phones/:categoryName.json', {}, {
      query: {method:'GET', params:{categoryName:'kovakuoriaiset'}, isArray:true}
    });
  }]);
phonecatServices.factory('Search', function() {
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