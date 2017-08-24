angular.module('app')
.service('SessionService', [function SessionFunction($rootScope, $ionicHistory) {

  var Session = {
    user: null,

    getUser: function() {
      Session.user = localStorage.getItem("user");
      return JSON.parse(Session.user);
    },
    setUser: function(data) {
      Session.user = JSON.stringify(data);
      localStorage.setItem("user", Session.user);
    },
    getUserLocation: function() {
      Session.userLocation = localStorage.getItem("userLocation");
      return JSON.parse(Session.userLocation);
    },
    setUserLocation: function(data) {
      Session.userLocation = JSON.stringify(data);
      localStorage.setItem("userLocation", Session.userLocation);
    },
    getTotalPrice: function() {
      Session.price = localStorage.getItem("price");
      return JSON.parse(Session.price);
    },
    setTotalPrice: function(data) {
      Session.price = JSON.stringify(data);
      localStorage.setItem("price", Session.price);
    },
    getTotalItem: function() {
      Session.item = localStorage.getItem("item");
      return JSON.parse(Session.item);
    },
    setTotalItem: function(data) {
      Session.item = JSON.stringify(data);
      localStorage.setItem("item", Session.item);
    },
    getTotalWeight: function() {
      Session.weight = localStorage.getItem("weight");
      return JSON.parse(Session.weight);
    },
    setTotalWeight: function(data) {
      Session.weight = JSON.stringify(data);
      localStorage.setItem("weight", Session.weight);
    },

    isLoggedIn: function() {
      if (!!Session.getUser()) {
        return true;
      } else {
        return false;
      }
    },
    cache: {},

  };
  return Session;
}]);
