angular
.module('consumer', [
	// Declare any module-specific AngularJS dependencies here
	'common'
])
.service('filterService', function() {
	var filters = [];
	localStorage.setItem('filters', JSON.stringify(filters));

	var addHash = function(newHash) {
		var temp = JSON.parse(localStorage.getItem('filters'));
		temp.push(newHash);
		localStorage.setItem('filters', JSON.stringify(temp));
	};

	var removeHash = function(oldHash) {
		var temp = JSON.parse(localStorage.getItem('filters'));
		var index = temp.indexOf(oldHash);
		if (index > -1) {
			temp.splice(index, 1);
		}
		localStorage.setItem('filters', JSON.stringify(temp));
	};

	var getHashes = function() {
		return JSON.parse(localStorage.getItem('filters'));
	};

	return {
		addHash: addHash,
		removeHash: removeHash,
		getHashes: getHashes
	};

})
.service('dateService', function() {
	var presetStart = "";
	var presetEnd = "";
	localStorage.setItem('presetStart', JSON.stringify(presetStart));
	localStorage.setItem('presetEnd', JSON.stringify(presetEnd));

	var addStart = function(newDate) {
		presetStart = newDate;
		localStorage.setItem('presetStart', JSON.stringify(newDate));
	}

	var removeStart = function() {
		localStorage.setItem('presetStart', JSON.stringify(""));
	}

	var addEnd = function(newDate) {
		presetEnd = newDate;
		localStorage.setItem('presetEnd', JSON.stringify(newDate));
	}

	var removeEnd = function() {
		localStorage.setItem('presetEnd', JSON.stringify(""));
	}

	var getStart = function() {
		return JSON.parse(localStorage.getItem('presetStart'));
	}

	var getEnd = function() {
		return JSON.parse(localStorage.getItem('presetEnd'));
	}

	return {
		addStart: addStart,
		removeStart: removeStart,
		addEnd: addEnd,
		removeEnd: removeEnd,
		getStart: getStart,
		getEnd: getEnd
	};
})
.service('validateService', function() {
	return {
		checkValid: function(item) {
			return (angular.isDefined(item) && item != "");	
		}
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
.controller('SearchController', function($scope, supersonic, $http, filterService, urlPrefix, validateService) {
	var count;

	$scope.found = { none: true };
	$scope.hideMoreButton = true;
	$scope.noMore = true;

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
				if(validateService.checkValid(presets)) {
			presetQuery = $scope.URLize(presets);
			contentQuery = "query=" + presetQuery;
		}

		if(validateService.checkValid($scope.search)) {
			var keywords = $scope.search.keywords;
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
.controller('SettingsController', function($scope, supersonic, filterService, dateService, validateService) {
	//initialize all the hides up here...
	$scope.hide = {sDate: true};
	$scope.hide = {eDate: true};
	$scope.hide = {sInput: false};
	$scope.hide = {eInput: false};
	$scope.hide = {sButton: false};
	$scope.hide = {eButton: false};
	$scope.dateSet = [];

	// for the view
	$scope.filterList = filterService.getHashes();

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

	$scope.addStartDate = function() {
		if(validateService.checkValid($scope.startDateInput)) {
			dateService.addStart($scope.startDateInput);
			$scope.dateSet.startDate = $scope.startDateInput;
			// show p, hide input and checkmark
			$scope.hide.sDate = false;
			$scope.hide.sInput = true;
			$scope.hide.sButton = true;
			$scope.startDateInput = "";
		}
	}

	$scope.deleteStartDate = function(toDelete) {
		if($scope.hide.sDate === false) {
			dateService.removeStart();
			$scope.dateSet.startDate = "";
			$scope.hide.sDate = true;
			$scope.hide.sInput = false;
			$scope.hide.sButton = false;
		}
	}

	$scope.addEndDate = function() {
		if(validateService.checkValid($scope.endDateInput)) {
			dateService.addEnd($scope.endDataInput);
			$scope.dateSet.endDate = $scope.endDateInput;
			$scope.hide.eDate = false;
			$scope.hide.eInput = true;
			$scope.hide.eButton = true;
			$scope.endDateInput = "";
		}
	}

	$scope.deleteEndDate = function() {
		if($scope.hide.eDate === false) {
			dateService.removeEnd();
			$scope.dateSet.endDate = "";
			$scope.hide.eData = true;
			$scope.hide.eInput = false;
			$scope.hide.eButton = false;
		}
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