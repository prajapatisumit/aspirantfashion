angular.module('app')
.factory('fireBaseData', function($firebase) {
	var ref = firebase.database().ref(),
    refCart = firebase.database().ref('cart'),
    refUser = firebase.database().ref('users'),
    refCategory = firebase.database().ref('category'),
		refSubCategory = firebase.database().ref('subcategory'),
    refOrder = firebase.database().ref('orders'),
    refFeatured = firebase.database().ref('featured'),
    refProduct = firebase.database().ref('product');

  return {
    ref: function() {
      return ref;
    },
    refCart: function() {
      return refCart;
    },
    refUser: function() {
      return refUser;
    },
    refCategory: function() {
      return refCategory;
    },
		refSubCategory: function() {
      return refSubCategory;
    },
    refOrder: function() {
      return refOrder;
    },
    refFeatured: function() {
      return refFeatured;
    },
    refProduct: function() {
      return refProduct;
    }

  }
});
