angular
.module('consumer', [
	// Declare any module-specific AngularJS dependencies here
	'common'
]);
angular
.module('consumer', [
	// Declare any module-specific AngularJS dependencies here
	'common'
])
.controller('MessageController', function($scope, supersonic, $http) {
	// ['supersonic'] is a dependency of SteroidsApplication
	$scope.load = { spinner: false };
	$http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK")
	.success(function(data, status, headers, config, scope) {
		$scope.allMsg = data;
		$scope.load.spinner = true;
		// $scope.$apply();
	})
	.error(function(data, status, headers, config) {
		supersonic.logger.log("Error: " + status);
		$scope.wLat = "Error: no connection";
	});

	$scope.update = function () {
		$scope.load.spinner = false;
		// $scope.$apply();
		supersonic.logger.log("updating...");
		$http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK")
		.success(function(data, status, headers, config, scope) {
			supersonic.logger.log("Success! " + status);
			$scope.allMsg = data;
			$scope.load.spinner = true;
			// $scope.$apply();
		})
		.error(function(data, status, headers, config) {
			supersonic.logger.log("Error: " + status);
			$scope.allMsg = {"messages":[{"userId":"Error!","message":"Please restart the app."}]};
		});
	}
})
.controller('SearchController', function($scope, supersonic, $http) {
	$scope.results = { hide: true };
	// ['supersonic'] is a dependency of SteroidsApplication
	$scope.search = function() {
		supersonic.logger.log("you tried to search!");
		var user = $scope.search.userId;
		var mcontent = $scope.search.msgcontent;
		var filters = $scope.search.filters;
		var start = $scope.search.startdate;
		var end = $scope.search.enddate;

		if(!angular.isDefined(user)) {
			user = "";
		}
		if(!angular.isDefined(mcontent)) {
			mcontent = "";
		}
		if(!angular.isDefined(filters)) {
			filters = "";
		}
		if(!angular.isDefined(start)) {
			start = "";
		}
		if(!angular.isDefined(end)) {
			end = "";
		}

		var url = "http://fleet.ord.cdk.com/storytellerconsumer/messages?tags=" + mcontent + "&callback=JSON_CALLBACK";

		console.log(url);

		$http.jsonp(url)
			.success(function(data, status, headers, config, scope) {
				supersonic.logger.log("Search success! " + status);
				// sharedProperties.set(data);
				$scope.allResults = data;
				$scope.results.hide = false;
			})
			.error(function(data, status, headers, config) {
				supersonic.logger.log("Error: " + status);
			});

	}
});
function loadButton() {
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
	if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0) {
		window.scrollBy(0, -50);
		timeOut = setTimeout('scrollToTop()', 10);
	} else {
		clearTimeout(timeOut);
		document.getElementById("refreshButton").click();
	}
}