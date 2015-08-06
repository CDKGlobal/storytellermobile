angular.module('consumer')
.controller('MessageController', function($scope, supersonic, $http, filterService, urlPrefix, modTimestamp) {
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

	$scope.modTime = function(oldStamp) {
		return modTimestamp.modTime(oldStamp);
	}

});