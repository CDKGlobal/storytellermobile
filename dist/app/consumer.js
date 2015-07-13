angular
.module('consumer', [
	// Declare any module-specific AngularJS dependencies here
	'common'
]);
angular
  .module('consumer')
  .controller('IndexController', function($scope, supersonic) {
    // Controller functionality here
  });

angular
.module('consumer', [
	// Declare any module-specific AngularJS dependencies here
	'common'
])
.controller('MessageController', function($scope, supersonic, $http) {
	// ['supersonic'] is a dependency of SteroidsApplication
	$scope.allMsg = {"messages":[{"userId":"Loading...","message":"Please wait"}]};

	$http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK")
	.success(function(data, status, headers, config, scope) {
		$scope.allMsg = data;
		$scope.apply;
	})
	.error(function(data, status, headers, config) {
		supersonic.logger.log("Error: " + status);
		$scope.wLat = "Error: no connection";
	});


	$scope.update = function () {
		supersonic.logger.log("updating...");
		$http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK")
		.success(function(data, status, headers, config, scope) {
			supersonic.logger.log("Success! " + status);
			$scope.allMsg = data;
			$scope.apply;
		})
		.error(function(data, status, headers, config) {
			supersonic.logger.log("Error: " + status);
			$scope.allMsg = {"messages":[{"userId":"Error!","message":"Please restart the app."}]};
		});
		$scope.apply;
	}
});
window.onload = function() {
	var topButton = document.getElementById("topNavButton");
	window.addEventListener("scroll", function (oEvent) {
		// var mydivpos = document.getElementById("allMessages").offsetTop;
		var height = window.innerHeight;
		if(window.pageYOffset > height) {
			topButton.style.display = "block";
		} else {
			topButton.style.display = "none";
		}
	});
}
var timeOut;
function scrollToTop() {
	if (document.body.scrollTop!=0 || document.documentElement.scrollTop!=0) {
		window.scrollBy(0,-50);
		timeOut=setTimeout('scrollToTop()',10);
	} else {
		clearTimeout(timeOut);
	}
               // show rotating thinger at the top
               // reload page
                // hide the thinger
}