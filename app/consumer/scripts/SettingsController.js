angular.module('consumer')
.controller('SettingsController', function($scope, supersonic, validateService, allStoriesService, $timeout, presetTimes) {
	//initialize all the hides up here...
	$scope.hide = {
		sDate: true,
		eDate: true,
		sInput: false,
		eInput: false,
		sButton: false,
		eButton: false
	};
	$scope.times = presetTimes;
	var storyName = "";

	supersonic.data.channel('story-name').subscribe(function(message) {
		storyName = message;
		// timeout required to update
		$timeout(function() {
			$scope.filterList = allStoriesService.getHashes(storyName);
			if(allStoriesService.getDate(storyName) != null) {
				$scope.startDropdown = $scope.times[parseInt(allStoriesService.getDate(storyName))];
			} else {
				$scope.startDropdown = $scope.times[0];
			}
		});
	});

	$scope.addFilter = function() {
		var newFilter = $scope.newInput;
		if(angular.isDefined(newFilter) && newFilter != "") {
			$scope.newInput = "";
			allStoriesService.addHash(storyName, newFilter);
			$scope.filterList = allStoriesService.getHashes(storyName);
		}
	}

	$scope.deleteFilter = function(toDelete) {
		allStoriesService.deleteHash(storyName, toDelete);
		$scope.filterList = allStoriesService.getHashes(storyName);
	}

	$scope.changedDate = function(item) {
		allStoriesService.setDate(storyName, item.id);
	}

	$scope.deleteStory = function() {
		allStoriesService.deleteStory(storyName);
		supersonic.ui.layers.popAll();
	}
});