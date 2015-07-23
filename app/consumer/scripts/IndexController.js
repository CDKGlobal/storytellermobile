angular
.module('consumer', [
	// Declare any module-specific AngularJS dependencies here
	'common'
])
.controller('MessageController', function($scope, supersonic, $http) {
	$scope.index = { spinner: false };
	$http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK")
	.success(function(data, status, headers, config, scope) {
		$scope.allMsg = data;
		$scope.index.spinner = true;
	})
	.error(function(data, status, headers, config) {
		supersonic.logger.log("Error: " + status);
		$scope.wLat = "Error: no connection";
	});

	$scope.update = function () {
		$scope.index.spinner = false;
		supersonic.logger.log("updating...");
		$http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK")
		.success(function(data, status, headers, config, scope) {
			supersonic.logger.log("Success! " + status);
			$scope.allMsg = data;
			$scope.index.spinner = true;
		})
		.error(function(data, status, headers, config) {
			supersonic.logger.log("Error: " + status);
		});
	}
})
.controller('SearchController', function($scope, supersonic, $http) {
	// $scope.results = { hide: true };
	$scope.found = { none: true };
	$scope.search = function() {
		document.activeElement.blur();
		var user = $scope.search.userId;
		var mcontent = $scope.search.msgcontent;
		var filters = $scope.search.filters;
		var start = $scope.search.startdate;
		var end = $scope.search.enddate;
		var contentQuery = "";

		if(!angular.isDefined(user)) {
			user = "";
		}
		if(angular.isDefined(mcontent)) {
			var contentParams = mcontent.match(/\w+|"(?:\\"|[^"])+"/g);
			var contentQuery = contentParams[0];
			for(var i = 1; i < contentParams.length; i++) {
				contentQuery += "," + contentParams[i];
			}
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

		var url = "http://fleet.ord.cdk.com/storytellerconsumer/messages?tags=" + contentQuery + "&callback=JSON_CALLBACK";

		$http.jsonp(url)
			.success(function(data, status, headers, config, scope) {
				supersonic.logger.log("Search success! " + status);
				$scope.allResults = data;
				if(data.messages.length === 0) {
					$scope.found.none = false;
				} else {
					$scope.found.none = true;
				}
			})
			.error(function(data, status, headers, config) {
				supersonic.logger.log("Search error: " + status);
			});
	}
});