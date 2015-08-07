angular.module('consumer')
.controller('SettingsController', function($scope, supersonic, validateService, allStoriesService, $timeout) {
	//initialize all the hides up here...
	$scope.hide = {
		sDate: true,
		eDate: true,
		sInput: false,
		eInput: false,
		sButton: false,
		eButton: false
	};
	$scope.times = [
		{name: "All time", id: "0"},
		{name: "1 month ago", id: "1"},
		{name: "2 months ago", id: "2"},
		{name: "3 months ago", id: "3"},
		{name: "6 months ago", id: "4"}
	];
	var storyName = "";

	supersonic.data.channel('story-name').subscribe(function(message) {
		storyName = message;
		// timeout required to update
		$timeout(function() {
			$scope.filterList = allStoriesService.getHashes(storyName);
			console.log(allStoriesService.getHashes(storyName));
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
			console.log(allStoriesService.getHashes(storyName));
		}
	}

	$scope.deleteFilter = function(toDelete) {
		allStoriesService.deleteHash(storyName, toDelete);
		$scope.filterList = allStoriesService.getHashes(storyName);
	}

	$scope.changedDate = function(item) {
		allStoriesService.setDate(storyName, item.id);
		console.log(allStoriesService.getDate(storyName));
	}

	$scope.deleteStory = function() {
		// allStoriesService.deleteStory(storyName);
		// $location.path('/index');
		// grab the current name...
		// remove it from localStorage
		// return to front view
	}
});