angular.module('consumer', ['common'])
.service('allStoriesService', function($filter) {
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
			if(newTags == null || angular.isUndefined(newTags)) {
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
		return storiesCopy.tags;
	};

	var getDate = function(storyName) {
		var storiesCopy = findStory(storyName);
		return storiesCopy.date;
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
					console.log(startQuery);
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
				console.log(startQuery);
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
	$http, basicStoryURL, validateService, increaseAmount, $filter, presetDelays, notifDelayService) {

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
		previewsList = [];
		angular.forEach(storiesCopy, function(story) {
			var msgList = [];
			// pass in array of hashes, date as a number
			var storyURL = basicStoryURL.getURL(allStoriesService.getHashes(story.name), allStoriesService.getDate(story.name));
			$http.jsonp(storyURL)
			.success(function(data, status, headers, config, scope) {
				supersonic.logger.log("Success! " + status);
				// if stored timestamp is different from the first message in returned api call
				if(validateService.checkValid(data.messages)) {
					// count new messages, using timestamp
					var newMsgCount = 0;
					var savedStamp = allStoriesService.getLatestViewStamp(story.name);
					while(newMsgCount < data.messages.length && (new Date(data.messages[newMsgCount].timeStamp)).toLocaleString() != savedStamp) {
						newMsgCount++;
						// add 3 most recent
						if(msgList.length < 3) {
							msgList.push(data.messages[newMsgCount].message);
						}
					}
					// update notification field, time of latest notification
					allStoriesService.setNotifications(story.name, newMsgCount);
					allStoriesService.setLatestNotifStamp(story.name, data.messages[0].timeStamp);
				}
			})
			.error(function(data, status, headers, config) {
				supersonic.logger.log("Error: " + status + " " + storyURL);
			});
			// ensures previews is of length 3 (preserved spacing)
			while(msgList.length < 3) {
				// non-breaking space
				msgList.push("\u00A0\u00A0");
			}
			previewsList.push({name: story.name, previews: msgList});
		})
		$timeout(function() {
			$scope.stories = allStoriesService.getStories();
		});
	}

	$scope.updateNotifications();
	var timeoutIndex = notifDelayService.getTimeout();
	var match = $filter('filter')(presetDelays, { id: timeoutIndex});
	var timeoutSeconds = parseInt(match.timeSec) * 1000;
	$interval(function() {
		$scope.updateNotifications();
		timeoutIndex = notifDelayService.getTimeout();
		match = $filter('filter')(presetDelays, { id: timeoutIndex});
		timeoutSeconds = parseInt(match.timeSec) * 1000;
		console.log(match);
	}, timeoutSeconds);

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

	$scope.previews = function(storyName) {
		// var match = $filter('filter')(previewsList, { name: storyName});
		return ["Real data about real things in the world ahh data data data data data hippopotamus moose and beans", storyName, "\u00A0\u00A0"];
		// return match[0].previews;
	}

	$scope.allowBlanks = function(previewMsg) {
		if(previewMsg === "") {
			return "<br />";
		} else {
			return previewMsg;
		}
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
	}

	$scope.deleteAll = function() {
		allStoriesService.deleteAll();
	}
})
.controller('LinkController', function($scope, supersonic, $sce) {
	// John Gruber's regex, modified for JS
	var linkRegex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
	var linkExp = new RegExp(linkRegex);
	var anchorRegex = /<a[^>]*>([^<]+)<\/a>/;
	var anchorExp = new RegExp(anchorRegex);
	var txtRegex = />.*</;
	var onclickRegex = /<a onclick=/;
	$scope.modLink = function(message) {
		var result;
		if(anchorExp.test(message)) {
			supersonic.logger.log("before while");
			while((result = anchorExp.exec(message)) !== null && result[0].indexOf("<a onclick") < 0) {
				supersonic.logger.log("result[0]: " + result[0]);
				var text = result[0].match(txtRegex);
				var modLink = "<a onclick=\"supersonic.app.openURL(\'" + linkExp.exec(result[0])[0] +"\')\" href=\"\"" + text + "/a>";
				supersonic.logger.log("message.indexOf(result[0]): " + message.indexOf(result[0]))
				message = message.replace(result[0], modLink);
				supersonic.logger.log(message);
			}
		}
		return $sce.trustAsHtml(message);
	}
})
.controller('AutocompleteController', function ($scope, $http, supersonic, urlPrefix) {
	$scope.dealerNameSearchTerm = [];

	var hold = " ";

    $scope.filterTagsBySearchTerm = function () {
    	supersonic.logger.log("Info enter..");
    	var newest = $scope.search.keywords;
    	var request = urlPrefix + "approximate?query=" + newest + "&callback=JSON_CALLBACK";

    	if (hold !== newest) {
			$http.jsonp(request)
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