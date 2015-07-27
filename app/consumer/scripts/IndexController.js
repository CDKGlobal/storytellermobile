angular
.module('consumer', [
	// Declare any module-specific AngularJS dependencies here
	'common'
])
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
.controller('SearchController', function($scope, supersonic, $http) {
	// $scope.results = { hide: true };
	$scope.found = { none: true };
	$scope.search = function() {
		document.activeElement.blur();
		var keywords = $scope.search.keywords;
		var start = $scope.search.startdate;
		var end = $scope.search.enddate;
		var contentQuery = "";
		var startQuery = "";
		var endQuery = "";

		if(angular.isDefined(keywords)) {
			var contentParams = keywords.match(/\w+|"(?:\\"|[^"])+"/g);
			contentQuery = contentParams[0];
			for(var i = 1; i < contentParams.length; i++) {
				contentQuery += "," + contentParams[i];
			}
		}
		if(angular.isDefined(start)) {
			startQuery = start;
		}
		if(angular.isDefined(end)) {
			endQuery = end;
		}

		var url = "http://fleet.ord.cdk.com/storytellerconsumer/search?query=" + encodeURIComponent(contentQuery) 
			+ "&start=" + encodeURIComponent(startQuery) + "&end=" + encodeURIComponent(endQuery) 
			+ "&callback=JSON_CALLBACK";

		var promise = $http.jsonp(url)
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
		return promise;
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