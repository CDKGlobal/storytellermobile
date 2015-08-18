angular.module('consumer')
.controller('SearchController', function($scope, supersonic, $http, urlPrefix, validateService, modTimestamp, allStoriesService, sharedSearchKeywords) {
	var count;
	var storyName = "";

	supersonic.data.channel('story-name').subscribe(function(message) {
		storyName = message;
	});

	$scope.found = { none: true };
	$scope.hideMoreButton = true;
	$scope.noMore = true;

	supersonic.ui.views.current.whenVisible(function() {
		$scope.found.none = true;
		$scope.hideMoreButton = true;
		$scope.noMore = true;
		$scope.allResults = null;

		$scope.search = {
			keywords: "",
			startdate: "",
			enddate: ""
		};
	});

	// puts array items into x,y,z format for url
	$scope.URLize = function(arr) {
		var arrQuery = "";
		if(validateService.checkValid(arr)) {
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

		supersonic.logger.log("You entered the search query");

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
		var presets = allStoriesService.getHashes(storyName);
		console.log("official get: " + presets);
		// if presets are valid, add them to the query
		if(presets != null && validateService.checkValid(presets)) {
			presetQuery = $scope.URLize(presets);
			contentQuery = "query=" + presetQuery;
		}

		if(validateService.checkValid($scope.search)) {
			var keywords = $scope.search.keywords;
			supersonic.logger.log("Get into the query");
			supersonic.logger.log("This is the keywords : " + keywords);

			var start = $scope.search.startdate;
			var end = $scope.search.enddate;

			if(validateService.checkValid(keywords)) {
				var contentParams = keywords.match(/\w+|"(?:\\"|[^"])+"/g);
				if(validateService.checkValid(contentQuery)) {
					contentQuery += "," + $scope.URLize(contentParams);
				} else {
					contentQuery = "query=" + $scope.URLize(contentParams);
				}

				baseUrl += searchAddOn + contentQuery;

				if(validateService.checkValid(start)) {
					startQuery = "&start=" + start;
					baseUrl += startQuery;
				}
				if(validateService.checkValid(end)) {
					endQuery = "&end=" + end;
					baseUrl += endQuery;
				}
				baseUrl += "&" + callback;
			} else if(validateService.checkValid(start) || validateService.checkValid(end)) {
				baseUrl += timeAddOn;
				if(validateService.checkValid(start)) {
					startQuery = "start=" + start;
					baseUrl += startQuery;
					if(validateService.checkValid(end)) {
						endQuery = "&end=" + end;
						baseUrl += endQuery;
					}
				} else {
					endQuery = "end=" + end;
					baseUrl += endQuery;
				}
				baseUrl += "&" + callback;
			} else {
				// if any search except the first one has no input params
				if(validateService.checkValid(contentQuery)) {
					baseUrl += searchAddOn + contentQuery + "&" + callback;
				} else {
					baseUrl += recordsAddOn + callback;
				}
			}
		// if the very first search has no input params
		} else {
			if(validateService.checkValid(contentQuery)) {
				baseUrl += searchAddOn + contentQuery + "&" + callback;
			} else {
				baseUrl += recordsAddOn + callback;
			}
		}

		console.log(baseUrl);
		supersonic.logger.log("This is the baseUrl: " + baseUrl);

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

	$scope.modTime = function(oldStamp) {
		return modTimestamp.modTime(oldStamp);
	}
});
