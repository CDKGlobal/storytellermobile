angular
.module('consumer', [
	// Declare any module-specific AngularJS dependencies here
	'common'
])
.service('filterService', function() {
	var filters = [];

	var addHash = function(newHash) {
		filters.push(newHash);
	};

	var removeHash = function(oldHash) {
		var index = filters.indexOf(oldHash);
		if (index > -1) {
			filters.splice(index, 1);
		}
	}

	var getHashes = function() {
		return filters;
	};

	return {
		addHash: addHash,
		removeHash: removeHash,
		getHashes: getHashes
	};

})
.controller('MessageController', function($scope, supersonic, $http) {
	$scope.index = { spinner: false };

	$scope.update = function () {
		$scope.index.spinner = false;
		supersonic.logger.log("updating...");
		var promise = $http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK")
		.success(function(data, status, headers, config, scope) {
			supersonic.logger.log("Success! " + status);
			$scope.allMsg = data;
			$scope.index.spinner = true;
		})
		.error(function(data, status, headers, config) {
			supersonic.logger.log("Error: " + status);
		});
		return promise
	}
})
.controller('SearchController', function($scope, supersonic, $http, $window, filterService) {
	$scope.found = { none: true };

	$scope.checkValid = function(item) {
		return (angular.isDefined(item) && item != "");	
	}

	// puts array items into x,y,z format for url
	$scope.URLize = function(arr) {
		var arrQuery;
		if($scope.checkValid(arr)) {
			arrQuery = arr[0];
			for(var i = 1; i < arr.length; i++) {
				arrQuery += "," + arr[i];
			}
		}
		return arrQuery;
	}

	$scope.search = function() {
		document.activeElement.blur();

		var keywords = $scope.search.keywords;
		var start = $scope.search.startdate;
		var end = $scope.search.enddate;
		var contentQuery = "";
		var startQuery = "";
		var endQuery = "";
		var presets = filterService.getHashes();
		var presetQuery = "";

		presetQuery = URLize(presets);

		var baseUrl = "http://fleet.ord.cdk.com/storytellerconsumer/";
		var messageAddOn = "messages?";
		var searchAddOn = "search?";
		var timeAddOn = "time?";
		var callback = "callback=JSON_CALLBACK";

		if($scope.checkValid(keywords)) {
			var contentParams = keywords.match(/\w+|"(?:\\"|[^"])+"/g);
			contentQuery = "query=" + $scope.URLize(contentParams);
			baseUrl += searchAddOn + contentQuery;

			if($scope.checkValid(start)) {
				startQuery = "&start=" + start;
				baseUrl += startQuery;
			}
			if($scope.checkValid(end)) {
				endQuery = "&end=" + end;
				baseUrl += endQuery;
			}
			baseUrl += "&" + callback;
		} else if($scope.checkValid(start) || $scope.checkValid(end)) {
			baseUrl += timeAddOn;
			if($scope.checkValid(start)) {
				startQuery = "start=" + start;
				baseUrl += startQuery;
				if($scope.checkValid(end)) {
					endQuery = "&end=" + end;
					baseUrl += endQuery;
				}
			} else {
				endQuery = "end=" + end;
				baseUrl += endQuery;
			}
			baseUrl += "&" + callback;
		} else {
			baseUrl += messageAddOn + callback;
		}

		console.log(baseUrl);
		supersonic.logger.log(baseUrl);

		var promise = $http.jsonp(baseUrl)
			.success(function(data, status, headers, config, scope) {
				supersonic.logger.log("Search success! " + status);
				$scope.allResults = data;
				if(data == null || data.messages.length === 0) {
					$scope.found.none = false;
				} else {
					$scope.found.none = true;
				}
			})
			.error(function(data, status, headers, config) {
				supersonic.logger.log("Search error: " + status);
			});
		return promise;
	}
})
.controller('SettingsController', function($scope, supersonic, filterService) {

	$scope.filterList = [];

	$scope.addFilter = function() {
		var newFilter = $scope.newInput;

		if(angular.isDefined(newFilter) && newFilter != "") {
			$scope.filterList.push(newFilter);
			$scope.newInput = "";
			filterService.addHash(newFilter);
		}
	}

	$scope.deleteFilter = function(toDelete) {
		var index = $scope.filterList.indexOf(toDelete);
		if (index > -1) {
			$scope.filterList.splice(index, 1);
		}
		filterService.removeHash(toDelete);
	}
})
.controller('LinkController', function($scope, supersonic, $sce) {
	$scope.modLink = function(message) {
		// John Gruber's regex, modified for JS
		var regex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
		var modified = message.replace(regex, "<a onclick=\"supersonic.app.openURL('$1')\" href=\"\">$1</a>");
		return $sce.trustAsHtml(modified);
	}
});