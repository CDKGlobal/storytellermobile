angular
.module('consumer', [
	// Declare any module-specific AngularJS dependencies here
	'common'
])
.service('filterService', function() {
	var filters = [];
	localStorage['filters'] = JSON.stringify(filters);

	var addHash = function(newHash) {
		var temp = JSON.parse(window.localStorage['filters']);
		temp.push(newHash);
		window.localStorage['filters'] = JSON.stringify(temp);
	};

	var removeHash = function(oldHash) {
		var temp = JSON.parse(window.localStorage['filters']);
		var index = temp.indexOf(oldHash);
		if (index > -1) {
			temp.splice(index, 1);
		}
		window.localStorage['filters'] = JSON.stringify(temp);
	}

	var getHashes = function() {
		return JSON.parse(window.localStorage['filters']);
	};

	return {
		addHash: addHash,
		removeHash: removeHash,
		getHashes: getHashes
	};

})
.constant('urlPrefix', 'http://fleet.ord.cdk.com/storytellerconsumer/')
.controller('MessageController', function($scope, supersonic, $http, filterService, urlPrefix) {
	$scope.index = { spinner: false };

	$scope.update = function () {
		$scope.index.spinner = false;
		supersonic.logger.log("updating...");

		var baseUrl = urlPrefix;
		var presets = filterService.getHashes();
		var presetQuery = "";
		if(angular.isDefined(presets) && presets != "") {
			presetQuery = presets[0];
			for(var i = 1; i < presets.length; i++) {
				presetQuery += "," + presets[i];
			}
			baseUrl += "search?query=" + presetQuery + "&callback=JSON_CALLBACK";
		} else {
			baseUrl += "messages?callback=JSON_CALLBACK";
		}
		console.log(baseUrl);
		var promise = $http.jsonp(baseUrl)
		.success(function(data, status, headers, config, scope) {
			supersonic.logger.log("Success! " + status);
			$scope.allMsg = data;
			$scope.index.spinner = true;
		})
		.error(function(data, status, headers, config) {
			supersonic.logger.log("Error: " + status);
		});
		return promise;
	}
})
.controller('SearchController', function($scope, supersonic, $http, filterService, urlPrefix) {
	var count;

	$scope.found = { none: true };
	$scope.hideMoreButton = true;
	$scope.noMore = true;

	$scope.checkValid = function(item) {
		return (angular.isDefined(item) && item != "");	
	}

	// puts array items into x,y,z format for url
	$scope.URLize = function(arr) {
		var arrQuery = "";
		if($scope.checkValid(arr)) {
			arrQuery = arr[0];
			for(var i = 1; i < arr.length; i++) {
				arrQuery += "," + arr[i];
			}
		}
		return arrQuery;
	}

	$scope.searchAll = function(num) {
		if (arguments.length === 1) {
			count = num;
		} else {
			count += 15;
		}

		document.activeElement.blur();

		var baseUrl = urlPrefix;
		var recordsAddOn = "records?";
		var searchAddOn = "search?";
		var timeAddOn = "time?";
		var countAddOn = "count=" + count;
		var callback = countAddOn + "&" + "callback=JSON_CALLBACK";

		var contentQuery = "";
		var startQuery = "";
		var endQuery = "";
		var presetQuery = "";

		// check presets first
		var presets = filterService.getHashes();
		console.log("official get: " + presets);
		// if presets are valid, add them to the query
		if($scope.checkValid(presets)) {
			presetQuery = $scope.URLize(presets);
			contentQuery = "query=" + presetQuery;
		}

		if($scope.checkValid($scope.search)) {
			var keywords = $scope.search.keywords;
			var start = $scope.search.startdate;
			var end = $scope.search.enddate;

			if($scope.checkValid(keywords)) {
				var contentParams = keywords.match(/\w+|"(?:\\"|[^"])+"/g);
				if($scope.checkValid(contentQuery)) {
					contentQuery += "," + $scope.URLize(contentParams);
				} else {
					contentQuery = "query=" + $scope.URLize(contentParams);
				}

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
			}
		// no params were put in; still check presets
		} else {
			if($scope.checkValid(contentQuery)) {
				baseUrl += searchAddOn + contentQuery + "&" + callback;
			} else {
				baseUrl += recordsAddOn + callback;
			}
		}

		console.log(baseUrl);

		var promise = $http.jsonp(baseUrl)
			.success(function(data, status, headers, config, scope) {
				supersonic.logger.log("Search success! " + status);
				$scope.allResults = data;
				if(data == null || data.messages.length === 0) {
					$scope.hideMoreButton = true;
					$scope.noMore = true;
					$scope.found.none = false;
				} else if (data.messages.length === count) {
					$scope.hideMoreButton = false;
					$scope.noMore = true;
					$scope.found.none = true;
				} else {
					$scope.hideMoreButton = true;
					$scope.noMore = false;
					$scope.found.none = true;
				}
			})
			.error(function(data, status, headers, config) {
				supersonic.logger.log("Search error: " + status);
				$scope.hideMoreButton = true;
				$scope.noMore = true;
				$scope.found.none = false;
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
			console.log(filterService.getHashes());
		}
	}

	$scope.deleteFilter = function(toDelete) {
		var index = $scope.filterList.indexOf(toDelete);
		if (index > -1) {
			$scope.filterList.splice(index, 1);
		}
		filterService.removeHash(toDelete);
		console.log(filterService.getHashes());
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