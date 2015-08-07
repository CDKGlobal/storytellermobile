angular.module('consumer', ['common'])
.service('allStoriesService', function() {
	var getStories = function() {
		return JSON.parse(localStorage.getItem('allStories'));
	};

	var addStory = function(newName, newTags, newDate) {
		var tempArr = JSON.parse(localStorage.getItem('allStories'));
		if(tempArr == null || angular.isUndefined(tempArr)) {
			tempArr = [];
		}
		// if newName is valid and not already taken
		if(newName != null && angular.isDefined(newName)) {
			if(newTags == null || angular.isUndefined(newTags)) {
				newTags = null;
			} else {
				newTags = newTags.split(", ");
			}
			tempArr.push({name: newName, tags: newTags, date: newDate});
			localStorage.setItem('allStories', JSON.stringify(tempArr));
		}
	};

	var deleteStory = function(name) {
		var tempArr = JSON.parse(localStorage.getItem('allStories'));
		var index = tempArr.indexOf(name);
		if (index > -1) {
			temp.splice(index, 1);
		}
		localStorage.setItem('allStories', JSON.stringify(tempArr));
	};

	var deleteAll = function() {
		localStorage.clear();
		var temp = [];
		localStorage.setItem('allStories', JSON.stringify(temp));
	}

	return {
		addStory: addStory,
		getStories: getStories,
		deleteStory: deleteStory,
		deleteAll: deleteAll
	};
})
.service('filterService', function() {
	var addHash = function(newHash) {
		if (localStorage.getItem('filters') === null) {
			var temp = [];
			localStorage.setItem('filters', JSON.stringify(temp));
		}
		var temp = JSON.parse(localStorage.getItem('filters'));
		if(temp.indexOf(newHash) < 0) {
			temp.push(newHash);
			localStorage.setItem('filters', JSON.stringify(temp));
		}
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
		if (localStorage.getItem('filters') === null) {
			var temp = [];
			localStorage.setItem('filters', JSON.stringify(temp));
		}
		return JSON.parse(localStorage.getItem('filters'));
	};

	return {
		addHash: addHash,
		removeHash: removeHash,
		getHashes: getHashes
	};
})
.service('dateService', function() {
	var setStart = function(newRange) {
		localStorage.setItem('presetStart', newRange);
	}

	var getStart = function() {
		return localStorage.getItem('presetStart');
	}

	return {
		setStart: setStart,
		getStart: getStart
	};
})
.service('validateService', function() {
	return {
		checkValid: function(item) {
			return (angular.isDefined(item) && item != "");	
		}
	};
})
.service('modTimestamp', function() {
	return {
		modTime: function(oldStamp) {
			var date = new Date(oldStamp);
			var newStamp = date.toLocaleString();
			return newStamp;
		}
	}
})
.constant('urlPrefix', 'http://fleet.ord.cdk.com/storytellerconsumer/')
.controller('FrontController', function($scope, supersonic, allStoriesService, $timeout) {
	$scope.stories = allStoriesService.getStories();

	$scope.story = {
		createInput: true,
		createButton: true
	};

	supersonic.ui.views.current.whenVisible( function () {
		console.log("VISIBLE");
		console.log(allStoriesService.getStories());
		$timeout(function() {
			$scope.stories = allStoriesService.getStories();
		});
	});

	$scope.createStory = function() {
		$scope.story.createInput = false;
		$scope.story.createButton = false;
	}

	$scope.approveCreate = function() {
		$scope.story.createInput = true;
		$scope.story.createButton = true;
		if($scope.newStoryName !== "") {
			allStoriesService.addStory($scope.newStoryName, $scope.newStoryTags, null);
			$scope.newStoryName = "";
			$scope.newStoryTags = "";
			$scope.stories = allStoriesService.getStories();
		}
	}
})
.controller('DrawerController', function($scope, supersonic, allStoriesService) {

	$scope.deleteAll = function() {
		allStoriesService.deleteAll();
	}
})
.controller('LinkController', function($scope, supersonic) {
	$scope.modLink = function(message) {
		// John Gruber's regex, modified for JS
		var regex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
		var modified = message.replace(regex, "<a onclick=\"supersonic.app.openURL('$1')\" href=\"\">$1</a>");
		return modified;
	}
});