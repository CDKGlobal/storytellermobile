angular.module('consumer', ['common'])
.service('allStoriesService', function($filter, validateService) {
	var findStory = function(storyName) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		var matches = $filter('filter')(storiesCopy, { name: storyName});
		if (matches != null) {
			return matches[0];
		} else {
			return null;
		}
	}

	var getStories = function() {
		return JSON.parse(localStorage.getItem('allStories'));
	};

	var addStory = function(newName, newTags, newDate) {
		var tempArr = JSON.parse(localStorage.getItem('allStories'));
		if(tempArr == null || angular.isUndefined(tempArr)) {
			tempArr = [];
		}
		// if newName is valid and not already taken
		if(newName != null && angular.isDefined(newName) && findStory(newName) == null) {
			if(!validateService.checkValid(newTags)) {
				newTags = null;
			} else {
				newTags = newTags.split(/[\s,]+/);
			}
			var newStamp = new Date();
			tempArr.push({name: newName, tags: newTags, date: newDate, latestViewStamp: newStamp, notifications: 0, latestNotifStamp: newStamp});
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
		var storiesCopy = findStory(storyName);
		if (storiesCopy != null) {
			return storiesCopy.tags;
		} else {
			return null;
		}
	};

	var getDate = function(storyName) {
		var storiesCopy = findStory(storyName);
		if (storiesCopy != null) {
			return storiesCopy.date;
		} else {
			return null;
		}
	};

	var addHash = function(storyName, newFilter) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				var temp = storiesCopy[i].tags;
				if(temp == null) {
					temp = [];
				}
				if (temp.indexOf(newFilter) == -1) {
					temp.push(newFilter);
				}
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

	var getLatestViewStamp = function(storyName) {
		var storiesCopy = findStory(storyName);
		return storiesCopy.latestViewStamp;
	};

	var setLatestViewStamp = function(storyName, newStamp) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				storiesCopy[i].latestViewStamp = newStamp;
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
		var storiesCopy = findStory(storyName);
		return storiesCopy.notifications;
	}

	var getLatestNotifStamp = function(storyName) {
		var storiesCopy = findStory(storyName);
		return storiesCopy.latestNotifStamp;
	}

	var setLatestNotifStamp = function(storyName, newStamp) {
		var storiesCopy = JSON.parse(localStorage.getItem('allStories'));
		for(var i = 0; i < storiesCopy.length; i++) {
			if(storiesCopy[i].name === storyName) {
				storiesCopy[i].latestNotifStamp = newStamp;
			}
		}
		localStorage.setItem('allStories', JSON.stringify(storiesCopy));
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
		getLatestViewStamp: getLatestViewStamp,
		setLatestViewStamp: setLatestViewStamp,
		getNotifications: getNotifications,
		setNotifications: setNotifications,
		getLatestNotifStamp: getLatestNotifStamp,
		setLatestNotifStamp: setLatestNotifStamp
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
.service('basicStoryURL', function(urlPrefix, validateService, dateService, increaseAmount) {
	return {
		getURL: function(hashtags, date) {
			var tempURL = urlPrefix;
			if(!validateService.checkValid(hashtags) && (!validateService.checkValid(date) || date == 0)) {
				// no presets stored; this is the same as calling /messages, but in the right order
				return tempURL + "records?count=" + increaseAmount + "&callback=JSON_CALLBACK";
			} else if(validateService.checkValid(hashtags)) {
				// hashes are preset
				var tagQuery = hashtags[0];
				for(var i = 1; i < hashtags.length; i++) {
					tagQuery += "," + hashtags[i];
				}
				if(!validateService.checkValid(date) || date == 0) {
					// date is also set
					startQuery = dateService.subtractMonths(date);
					if(startQuery == null) {
						return tempURL + "search?query=" + tagQuery + "&callback=JSON_CALLBACK";
					} else {
						return tempURL + "search?query=" + tagQuery + "&start=" + startQuery + "&callback=JSON_CALLBACK";
					}
				} else {
					return tempURL + "search?query=" + tagQuery + "&callback=JSON_CALLBACK";
				}
			} else {
				// only date is set
				startQuery = dateService.subtractMonths(date);
				if(startQuery == null) {
					return tempURL + "records?count=" + increaseAmount + "&callback=JSON_CALLBACK";
				} else {
					return tempURL + "time?start=" + startQuery + "&callback=JSON_CALLBACK";
				}
			}
		}
	}
})
.service('dateService', function() {
	return {
		subtractMonths: function(dateObj) {
			var toSubtract;
			if(dateObj == 0) {
				toSubtract = 0;
			} else if(dateObj == 1) {
				toSubtract = 1;
			} else if(dateObj == 2) {
				toSubtract = 2;
			} else if(dateObj == 3) {
				toSubtract = 3;
			} else if(dateObj == 4) {
				toSubtract = 6;
			} else {
				toSubtract = 0;
			}

			var current = new Date();
			if(toSubtract === 0) {
				return null;
			} else {
				console.log(toSubtract);
				current.setMonth(current.getMonth() - toSubtract);
				return (current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate());
			}
		}
	}
})
.service('notifDelayService', function() {
	var setTimeout = function(newTime) {
		localStorage.setItem('notifDelay', JSON.stringify(newTime));
	}

	var getTimeout = function() {
		return JSON.parse(localStorage.getItem('notifDelay'));
	}

	return {
		setTimeout: setTimeout,
		getTimeout: getTimeout
	}
})
.service('cachePreviews', function(validateService, $filter) {
	// map names, 3 story previews in localStorage

	var setPreview = function(storyName, previewArr) {
		// previewArr should be an array of objects
		var tempArr = JSON.parse(localStorage.getItem('allPreviews'));
		if(!validateService.checkValid(tempArr)) {
			tempArr = [];
		}
		// delete old one
		for(var i = 0; i < tempArr.length; i++) {
			if(tempArr[i].name === storyName) {
				tempArr.splice(i, 1);
			}
		}
		var newItem = {name: storyName, threePreviews: previewArr};
		tempArr.push(newItem);
		localStorage.setItem('allPreviews', JSON.stringify(tempArr));
	}

	var getPreview = function(storyName) {
		var tempArr = JSON.parse(localStorage.getItem('allPreviews'));
		var matches = $filter('filter')(tempArr, { name: storyName});
		if(validateService.checkValid(matches) && validateService.checkValid(matches[0]) && validateService.checkValid(matches[0].threePreviews)) {
			return matches[0].threePreviews;
		}
		return [];
	}

	return {
		setPreview: setPreview,
		getPreview: getPreview
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
.constant('presetDelays', [
	{name: "3 seconds", timeSec: "3", id: "0"},
	{name: "30 seconds", timeSec: "30", id: "1"},
	{name: "1 minute", timeSec: "60", id: "2"},
	{name: "5 minutes", timeSec: "120", id: "3"},
	{name: "1 hour", timeSec: "3600", id: "4"}
])
.constant('increaseAmount', 15)
.controller('FrontController', function($scope, supersonic, allStoriesService, $timeout, $interval, 
	$http, basicStoryURL, validateService, increaseAmount, $filter, presetDelays, notifDelayService, cachePreviews) {

	$scope.stories = allStoriesService.getStories();
	var previewsList = [];

	$scope.story = {
		createInput: true,
		createButton: true
	};

	supersonic.ui.views.current.whenVisible( function () {
		$timeout(function() {
			$scope.updateNotifications();
		});
	});

	$scope.updateNotifications = function() {
		var storiesCopy = allStoriesService.getStories();
		angular.forEach(storiesCopy, function(story) {
			// temp storage
			var msgList = [];
			var storyURL = basicStoryURL.getURL(allStoriesService.getHashes(story.name), allStoriesService.getDate(story.name));
			$http.jsonp(storyURL)
			.success(function(data, status, headers, config, scope) {
				supersonic.logger.log("Success! " + status);

				if(validateService.checkValid(data.messages) && data.messages.length > 0) {
					var newMsgCount = 0;
					var msgIndex = 0;
					var savedStamp = allStoriesService.getLatestViewStamp(story.name);
					
					while(msgIndex < data.messages.length && (msgList.length < 3 || new Date(data.messages[msgIndex].timeStamp).getTime() > new Date(savedStamp).getTime())) {
						var msgTime = new Date(data.messages[msgIndex].timeStamp).getTime();
						var savedTime = new Date(savedStamp).getTime();
						if(msgTime > savedTime) {
							newMsgCount++;
						}
						if(msgList.length < 3) {
							var item = {content: data.messages[msgIndex].message, stamp: data.messages[msgIndex].timeStamp}
							msgList.push(item);
						} 
						msgIndex++;
					}
					allStoriesService.setNotifications(story.name, newMsgCount);
					if(angular.isDefined(data.messages[0])) {
						allStoriesService.setLatestNotifStamp(story.name, (new Date(data.messages[0].timeStamp)));
					}
					// only update if there is a change
					var thisPreviews = cachePreviews.getPreview(story.name);
					if(!validateService.checkValid(thisPreviews) || msgList[0].stamp != thisPreviews[0].stamp) {
						cachePreviews.setPreview(story.name, msgList);
					}
				}
			})
			.error(function(data, status, headers, config) {
				supersonic.logger.log("Error: " + status + " " + storyURL);
			});
			msgList.length = 0;
		})
		$timeout(function() {
			$scope.stories = allStoriesService.getStories();
		});
	}

	$scope.updateNotifications();
	var timeoutIndex = notifDelayService.getTimeout();
	// match timeout to a number
	var match = $filter('filter')(presetDelays, { id: timeoutIndex});
	var timeoutSeconds;
	if(!validateService.checkValid(match)) {
		notifDelayService.setTimeout(0);
		timeoutSeconds = 3000;
	} else {
		timeoutSeconds = parseInt(match[0].timeSec) * 1000;
	}
	function cycleNotifications() {
		$scope.updateNotifications();
		timeoutIndex = notifDelayService.getTimeout();
		match = $filter('filter')(presetDelays, { id: timeoutIndex});
		if(!validateService.checkValid(match)) {
			notifDelayService.setTimeout(0);
			timeoutSeconds = 3000;
		} else {
			timeoutSeconds = parseInt(match[0].timeSec) * 1000;
		}
		clearTimeout(timer);
		timer = setTimeout(cycleNotifications, timeoutSeconds);
	}

	var timer = setTimeout(cycleNotifications, timeoutSeconds);

	supersonic.data.channel('timeout-change').subscribe(function(message) {
		match = $filter('filter')(presetDelays, { id: message});
		timeoutSeconds = parseInt(match[0].timeSec) * 1000;
		clearTimeout(timer);
		timer = setTimeout(cycleNotifications, timeoutSeconds);
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

	$scope.addPlus = function(num) {
		if(num === increaseAmount) {
			return "" + num + "+";
		} else {
			return num;
		}
	}

	$scope.cancelCreate = function() {
		$scope.story.createInput = true;
		$scope.story.createButton = true;
		$scope.newStoryName = "";
		$scope.newStoryTags = "";
	}

	$scope.getPreviews = function(storyName) {
		return cachePreviews.getPreview(storyName);
	}

})
.controller('DrawerController', function($scope, supersonic, allStoriesService, presetDelays, notifDelayService, $timeout, $filter) {
	$scope.delays = presetDelays;

	$timeout(function() {
		if(notifDelayService.getTimeout() != null) {
			$scope.delayDropdown = $scope.delays[parseInt(notifDelayService.getTimeout())];
		} else {
			$scope.startDropdown = $scope.delays[0];
		}
	});

	$scope.changedDelay = function(newTime) {
		notifDelayService.setTimeout(newTime.id);
		supersonic.data.channel('timeout-change').publish(newTime.id);
	}

	$scope.deleteAll = function() {
		allStoriesService.deleteAll();
		supersonic.ui.layers.popAll();
	}
})
.controller('LinkController', function($scope, supersonic, $sce) {
	$scope.modLink = function(message) {
		return $sce.trustAsHtml(message);
	}
})
.controller('AutocompleteController', function ($scope, $http, supersonic, urlPrefix) {
	$scope.hashtagSuggestions = [];

	var hold = "";

    $scope.filterTagsBySearchTerm = function () {
    	supersonic.logger.log("Info enter..");
    	var newest = $scope.search.keywords;
    	var request = urlPrefix + "approximate?query=" + newest + "&callback=JSON_CALLBACK";

    	if (hold !== newest) {
			$http.jsonp(request)
				.success(function(data, status, headers, config, scope) {
					var result = [];
					var runner = data.messages;
					for (var i = 0; i < runner.length; i++) {
						result.push(runner[i].hashTag);
					}
					$scope.hashtagSuggestions = result;
					supersonic.logger.log("Autocomplete http Success! " + status);
				})
				.error(function(data, status, headers, config) {
					supersonic.logger.log("Autocomplete http Failure! " + status);
				});
			hold = newest;
    	}
    };

    $scope.changeSearchWord = function(searchkeywords) {
    	$scope.search.keywords = searchkeywords.substring(1,searchkeywords.length);
    	$scope.searchAll(15);
    }
});