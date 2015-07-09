angular
.module('SteroidsApplication', ['supersonic'])

.controller('MessageController', function($scope, supersonic, $http) {
	// ['supersonic'] is a dependency of SteroidsApplication
	$scope.getMsgs = function() {

		$http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK")
		.success(function(data, status, headers, config, scope) {
			supersonic.logger.log("Success! " + status);
			$scope.messages = data;
			$scope.apply;
		})
		.error(function(data, status, headers, config) {
			supersonic.logger.log("Error: " + status);
			$scope.wLat = "Error: no connection";
		});
	}

	setInterval($scope.getMsgs, 5000);
});