angular.module('consumer')
.controller('MessageController', function($scope, supersonic, $http, urlPrefix, modTimestamp, $timeout, allStoriesService, validateService) {
	$scope.index = {spinner: false};
	$scope.stories = {hide: true};
	var storyName;

	supersonic.data.channel('story-name').subscribe(function(message) {
		console.log("received a message " + message);
		$scope.storyTitle = message;
		storyName = message;
		// var currentFilters = $scope.findFilters(message);
		// hashes, dates should be set up...below
		$scope.update();
	});

	supersonic.ui.views.current.whenVisible(function() {
		$scope.stories.hide = true;
		$timeout(function() {
			$scope.update();
		});
	});

	supersonic.ui.views.current.whenHidden(function() {
		$scope.stories.hide = true;
	});

	$scope.update = function () {
		$scope.index.spinner = false;
		supersonic.logger.log("updating...");

		var baseUrl = urlPrefix;
		var presets = allStoriesService.getHashes($scope.storyTitle);
		var presetQuery = "";
		if(angular.isDefined(presets) && presets != "" && presets != null) {
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
			$scope.stories.hide = false;
			if(validateService.checkValid(data)) {
				allStoriesService.setLatestStamp(storyName, $scope.modTime(data.messages[data.messages.length - 1].timeStamp));
			}
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