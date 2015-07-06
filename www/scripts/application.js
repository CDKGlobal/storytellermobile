angular.module('SteroidsApplication', [
  'supersonic'
])
.controller('IndexController', function($scope, supersonic) {

  $scope.navbarTitle = "Consumer Application";

});
window.onload = function() {
	var target = document.getElementById("messages");
	window.setInterval(function() {
		var entry = document.createElement('li');
		entry.appendChild(document.createTextNode("Fake message! " + Math.random()));
		target.insertBefore(entry, target.childNodes[0]);
	}, 15000);
}