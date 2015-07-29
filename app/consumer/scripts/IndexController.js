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

	var getHashes = function() {
		return filters;
	};

	return {
		addHash: addHash,
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

	// $scope.setHash = function(newPreset) {
	// 	console.log("setter called");
	// 	filterService.addHash(newPreset);
	// }

	// $scope.getHash = function() {
	// 	console.log("getter called");
	// 	return filterService.getHashes();
	// }

	$scope.search = function() {
		document.activeElement.blur();
		
		// var presetFilters = presetFilterList;
		console.log($window.handleFilters.getFilters());


		var keywords = $scope.search.keywords;
		var start = $scope.search.startdate;
		var end = $scope.search.enddate;
		var contentQuery = "";
		var startQuery = "";
		var endQuery = "";

		var baseUrl = "http://fleet.ord.cdk.com/storytellerconsumer/";
		var messageAddOn = "messages?";
		var searchAddOn = "search?";
		var timeAddOn = "time?";
		var callback = "callback=JSON_CALLBACK";

		console.log(keywords);

		if($scope.checkValid(keywords)) {
			var contentParams = keywords.match(/\w+|"(?:\\"|[^"])+"/g);
			contentQuery = "query=" + contentParams[0];
			for(var i = 1; i < contentParams.length; i++) {
				contentQuery += "," + contentParams[i];
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
		} else {
			baseUrl += messageAddOn + callback;
		}

		console.log(baseUrl);

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
.controller('SettingsController', function($rootScope, $scope, supersonic, $sce, $compile) {

	$scope.approveFilter = function() {
		// turn textbox into permanent box...
		// delete approve button
		console.log("approved!");
	}

	$scope.rejectFilter = function() {
		// delete input, both buttons
		console.log("rejected");
	}

	// add filters here, manage the view
	$scope.addFilter = function() {
		console.log("added");
		var fullList = angular.element(document.querySelector('#filters'));

		var newListItem = angular.element('<li></li>');

		var newTextBox = angular.element('<input type="text" />');
		var approveButton = angular.element('<button></button>');
		approveButton.attr('class', 'icon super-checkmark-circled');
		approveButton.attr('ng-click', 'approveFilter()');

		var rejectButton = angular.element('<button></button>');
		rejectButton.attr('class', 'icon super-close-circled');
		rejectButton.attr('ng-click', 'rejectFilter()');

		newListItem.append(newTextBox);
		newListItem.append(approveButton);
		newListItem.append(rejectButton);
		fullList.append(newListItem);

		$compile(newListItem)($scope);
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