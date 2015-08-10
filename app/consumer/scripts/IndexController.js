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
				newTags = newTags.split(/[\s,]+/);
			}
			tempArr.push({name: newName, tags: newTags, date: newDate});
			localStorage.setItem('allStories', JSON.stringify(tempArr));
		}
	};

	var deleteStory = function(storyName) {
		var tempArr = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < tempArr.length; i++) {
			if(tempArr[i].name === storyName) {
				tempArr.splice(i, 1);
			}
		}
		localStorage.setItem('allStories', JSON.stringify(tempArr));
	};

	var deleteAll = function() {
		localStorage.clear();
		var temp = [];
		localStorage.setItem('allStories', JSON.stringify(temp));
	}

	// finds filters based on input name
	var getHashes = function(storyName) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				return storiesCopy[i].tags;
			}
		}
		var none = [];
		return none;
	};

	var getDate = function(storyName) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				return storiesCopy[i].date;
			}
		}
		var none = [];
		return none;
	};

	var addHash = function(storyName, newFilter) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				var temp = storiesCopy[i].tags;
				if(temp == null) {
					temp = [];
				}
				temp.push(newFilter);
				storiesCopy[i].tags = temp;
			}
		}
		localStorage.setItem('allStories', JSON.stringify(storiesCopy));
	};

	var deleteHash = function(storyName, oldHash) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				var temp = storiesCopy[i].tags;
				var index = temp.indexOf(oldHash);
				if (index > -1) {
					temp.splice(index, 1);
				}
				storiesCopy[i].tags = temp;
			}
		}
		localStorage.setItem('allStories', JSON.stringify(storiesCopy));
	};

	var setDate = function(storyName, newRange) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				storiesCopy[i].date = newRange;
			}
		}
		localStorage.setItem('allStories', JSON.stringify(storiesCopy));		
	};

	return {
		addStory: addStory,
		getStories: getStories,
		deleteStory: deleteStory,
		deleteAll: deleteAll,
		getHashes: getHashes,
		getDate: getDate,
		addHash: addHash,
		deleteHash: deleteHash,
		setDate: setDate
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

	$scope.publishInfo = function(storyName) {
		console.log("publish...");
		supersonic.data.channel('story-name').publish(storyName);
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
})
.controller('AutocompleteController', function ($scope, $http, supersonic) {
	$scope.dealerNameSearchTerm = [];

	var hold = " ";

    $scope.filterTagsBySearchTerm = function () {
    	supersonic.logger.log("Info enter..");
    	var newest = $scope.search.keywords;

    	if (hold !== newest) {
			$http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/approximate?query=" + newest + "*&callback=JSON_CALLBACK")
				.success(function(data, status, headers, config, scope) {
					$scope.dealerNameSearchTerm = data.messages;
					supersonic.logger.log("Autocomplete http Success! " + status);
				})
				.error(function(data, status, headers, config) {
					supersonic.logger.log("Autocomplete http Failure! " + status);
				});
			hold = newest;
    	}

    	
    };
});