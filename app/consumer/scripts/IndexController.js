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
			tempArr.push({name: newName, tags: newTags, date: newDate, latestStamp: "", notifications: 0});
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

	var getLatestStamp = function(storyName) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				return storiesCopy[i].latestStamp;
			}
		}
		return "";
	};

	var setLatestStamp = function(storyName, newStamp) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				storiesCopy[i].latestStamp = newStamp;
			}
		}
		localStorage.setItem('allStories', JSON.stringify(storiesCopy));
	};

	var setNotifications = function(storyName, newNum) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				storiesCopy[i].notifications = newNum;
			}
		}
		localStorage.setItem('allStories', JSON.stringify(storiesCopy));
	}

	var getNotifications = function(storyName) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				return storiesCopy[i].notifications;
			}
		}
		return "2015-01-01 12:00:00 AM";
	}

	return {
		addStory: addStory,
		getStories: getStories,
		deleteStory: deleteStory,
		deleteAll: deleteAll,
		getHashes: getHashes,
		getDate: getDate,
		addHash: addHash,
		deleteHash: deleteHash,
		setDate: setDate,
		getLatestStamp: getLatestStamp,
		setLatestStamp: setLatestStamp,
		getNotifications: getNotifications,
		setNotifications: setNotifications
	};
})
.service('validateService', function() {
	return {
		checkValid: function(item) {
			return (angular.isDefined(item) && item != "" && item != null);	
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
.service('basicStoryURL', function(urlPrefix, validateService, dateService, presetTimes) {
	return {
		getURL: function(hashtags, date) {
			var tempURL = urlPrefix;
			if(!validateService.checkValid(hashtags) && !validateService.checkValid(date)) {
				// no presets stored; this is the same as calling /messages, but in the right order
				return tempURL + "records?count=50&callback=JSON_CALLBACK";
			} else if(validateService.checkValid(hashtags)) {
				// hashes are preset
				var tagQuery = hashtags[0];
				for(var i = 1; i < hashtags.length; i++) {
					tagQuery += "," + hashtags[i];
				}
				if(!validateService.checkValid(date)) {
					// date is also set
					// *****CHAGE*****
					startQuery = dateService.subtractMonths(date, presetTimes[date]);
					console.log(startQuery);
					return tempURL + "search?query=" + tagQuery + "&start=" + startQuery + "&callback=JSON_CALLBACK";
				} else {
					return tempURL + "search?query=" + tagQuery + "&callback=JSON_CALLBACK";
				}
			} else {
				// only date is set
				startQuery = dateService.subtractMonths(date, presetTimes[date]);
				console.log(startQuery);
				return tempURL + "time?start=" + startQuery + "&callback=JSON_CALLBACK";
			}
		}
	}
})
.service('dateService', function() {
	return {
		subtractMonths: function(currentStamp, dropValue) {
			var toSubtract = 0;
			//current timestamp is in the form 8/10/2015 2:54:46 PM
			switch(dropValue) {
				case "1 month ago":
					toSubtract = 1;
				case "2 months ago":
					toSubtract = 2;
				case "3 months ago":
					toSubtract = 3;
				case "6 months ago":
					toSubtract = 6;
			}

			var current = new Date(currentStamp);
			current.setMonth(current.getMonth() - toSubtract);
			return (current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate());
		}
	}
})
.constant('urlPrefix', 'http://fleet.ord.cdk.com/storytellerconsumer/')
.constant('presetTimes', [
	{name: "All time", id: "0"},
	{name: "1 month ago", id: "1"},
	{name: "2 months ago", id: "2"},
	{name: "3 months ago", id: "3"},
	{name: "6 months ago", id: "4"}
])
.controller('FrontController', function($scope, supersonic, allStoriesService, $timeout, $interval, $http, basicStoryURL, validateService) {
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

	$scope.updateNotifications = function() {
		var storiesCopy = allStoriesService.getStories();
		angular.forEach(storiesCopy, function(story) {
			var storyURL = basicStoryURL.getURL(story.tags, story.date);
			$http.jsonp(storyURL)
			.success(function(data, status, headers, config, scope) {
				supersonic.logger.log("Success! " + status);
				// if stored timestamp is different from the first message in returned api call
				if(validateService.checkValid(data.messages)) {
					// count new messages, using timestamp
					var newMsgCount = 0;
					var savedStamp = allStoriesService.getLatestStamp(story.name);
					while(newMsgCount < data.messages.length && (new Date(data.messages[newMsgCount].timeStamp)).toLocaleString() != savedStamp) {
						newMsgCount++;
					}
					// update notification field
					allStoriesService.setNotifications(story.name, newMsgCount);
				}
			})
			.error(function(data, status, headers, config) {
				supersonic.logger.log("Error: " + status + " " + storyURL);
			});
		})
		$timeout(function() {
			$scope.stories = allStoriesService.getStories();
		});
	}

	$scope.updateNotifications();
	$interval(function() {
		$scope.updateNotifications();
	}, 5000);

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
});