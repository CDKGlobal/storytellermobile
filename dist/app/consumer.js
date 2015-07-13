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
		$http.jsonp("https://api.forecast.io/forecast/f9bc1181900dcc4b7555f6e48e4998a7/37.8267,-122.423?callback=JSON_CALLBACK")
		.success(function(data, status, headers, config, scope) {
			supersonic.logger.log("Success! " + status);
			$scope.allMsg = data;
			$scope.apply;
		})
		.error(function(data, status, headers, config) {
			supersonic.logger.log("Error: " + status);
			$scope.allMsg = {"messages":[{"userId":"Error!","message":"Please restart the app."}]};
		});
	}
});