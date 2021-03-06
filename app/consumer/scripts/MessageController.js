angular.module('consumer')
.controller('MessageController', function($scope, supersonic, $http, urlPrefix, modTimestamp, $timeout, allStoriesService, validateService, increaseAmount, dateService) {
	var count;
	// John Gruber's regex, modified for JS
	var linkRegex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
	var linkExp = new RegExp(linkRegex);
	var anchorRegex = /<a[^>]*>([^<]+)<\/a>/gi;
	var anchorExp = new RegExp(anchorRegex);
	var txtRegex = />.*</;

	$scope.index = {spinner: false};
	$scope.stories = {hide: true};
	$scope.hideMoreButton = true;
	$scope.noMore = true;
	var storyName;

	supersonic.data.channel('story-name').subscribe(function(message) {
		console.log("received a message " + message);
		$scope.storyTitle = message;

		storyName = message;
		$scope.update(increaseAmount);
	});

	supersonic.ui.views.current.whenVisible(function() {
		$scope.stories.hide = true;
		$timeout(function() {
			$scope.update(increaseAmount);
		});
	});

	supersonic.ui.views.current.whenHidden(function() {
		$scope.stories.hide = true;
	});

	$scope.update = function (num) {
		if (arguments.length === 1) {
			count = num;
		} else {
			supersonic.logger.log("adding fifteen");
			count += increaseAmount;
		}

		$scope.index.spinner = false;
		supersonic.logger.log("updating...");

		var startDate = null;
		if(allStoriesService.getDate(storyName) != null) {
			var setDate = allStoriesService.getDate(storyName);
			startDate = dateService.subtractMonths(setDate);
		}

		var baseUrl = urlPrefix;
		var presets = allStoriesService.getHashes($scope.storyTitle);
		var presetQuery = "";
		if(validateService.checkValid(presets)&& startDate != null) {
			presetQuery = presets[0];
			for(var i = 1; i < presets.length; i++) {
				presetQuery += "," + presets[i];
			}
			console.log("query+startDate loading...");
			baseUrl += "search?query=" + presetQuery + "&start=" + startDate + "&count=" + count + "&callback=JSON_CALLBACK";
		} else if (validateService.checkValid(presets) && startDate == null) {
			presetQuery = presets[0];
			for(var i = 1; i < presets.length; i++) {
				presetQuery += "," + presets[i];
			}
			console.log("query loading...");
			baseUrl += "search?query=" + presetQuery + "&count=" + count + "&callback=JSON_CALLBACK";
		} else if (startDate != null) {
			console.log("startDate loading...");
			baseUrl += "time?start=" + startDate + "&count=" + count + "&callback=JSON_CALLBACK";
		} else {
			console.log("records loading...");
			baseUrl += "records?count=" + count + "&callback=JSON_CALLBACK";
		}
		console.log(baseUrl);
		var promise = $http.jsonp(baseUrl)
		.success(function(data, status, headers, config, scope) {
			supersonic.logger.log("Success! updating " + status);
			$scope.allMsg = $scope.processMessages(data);
			if(data == null || data.messages.length === 0) {
				$scope.hideMoreButton = true;
				$scope.noMore = true;
			} else if (data.messages.length === count) {
				$scope.hideMoreButton = false;
				$scope.noMore = true;
			} else {
				$scope.hideMoreButton = true;
				$scope.noMore = false;
			}
			$scope.index.spinner = true;
			$scope.stories.hide = false;
			if(validateService.checkValid(data)) {
				allStoriesService.setLatestViewStamp(storyName, (new Date()).toLocaleString());
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

	// add onclick to all links in messages
	$scope.processMessages = function(allData) {
		var modifiedData = [];
		var tempData = allData.messages;
		for(var i = 0; i < tempData.length; i++) {
			var tempStory = tempData[i];
			var message = tempStory.message;
			if(anchorExp.test(message)) {
				while((result = anchorExp.exec(message)) !== null && result[0].indexOf("<a onclick") < 0) {
					var text = result[0].match(txtRegex);
					var modLink = "<a onclick=\"supersonic.app.openURL(\'" + linkExp.exec(result[0])[0] +"\')\" href=\"\"" + text + "/a>";
					supersonic.logger.log("message.indexOf(result[0]): " + message.indexOf(result[0]))
					message = message.replace(result[0], modLink);
				}
			}
			tempStory.message = message;
			modifiedData.push(tempStory);
		}
		var wrapArr = {messages: modifiedData};
		return wrapArr;
	}

});