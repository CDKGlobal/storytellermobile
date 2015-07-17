angular
.module('consumer', [
	// Declare any module-specific AngularJS dependencies here
	'common'
])
.service('sharedProperties', function() {
	var paramArr = {
		userId: '',
		mcontent: '',
		filters: '',
		start: '',
		end: ''
	};

	return {
		getArr: function() {
			return paramArr;
		},
		setArr: function(value) {
			paramArr = value;
		}
	}
})
.controller('MessageController', function($scope, supersonic, $http, $timeout) {
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
			$scope.$apply();
		})
		.error(function(data, status, headers, config) {
			supersonic.logger.log("Error: " + status);
			$scope.allMsg = {"messages":[{"userId":"Error!","message":"Please restart the app."}]};
		});
	}
})
.controller('SearchController', function($scope, supersonic, $http, sharedProperties) {
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

		var params = {
			'userId': user,
			'mcontent': mcontent,
			'filters': filters,
			'start': start,
			'end': end
		};
		sharedProperties.setArr(params);
		supersonic.logger.log(sharedProperties.getArr());
	}
})
.controller('ResultController', function($rootScope, $scope, supersonic, $http, $timeout, sharedProperties) {

	$rootScope.$watchCollection('sharedProperties.getArr()', function(newVal, oldVal) {
		supersonic.logger.log("value changed:");
		
		var params = sharedProperties.getArr();
		supersonic.logger.log(params.mcontent);

		var url = "http://fleet.ord.cdk.com/storytellerconsumer/messages?tags=" + params.mcontent + "&callback=JSON_CALLBACK";
		$http.jsonp(url)
		.success(function(data, status, headers, config, scope) {
			supersonic.logger.log("Search success! " + status);
			$scope.allResults = data;
		})
		.error(function(data, status, headers, config) {
			supersonic.logger.log("Error: " + status);
		});
	});
});