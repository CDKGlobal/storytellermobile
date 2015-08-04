angular.module('consumer', ['common'])
.service('filterService', function() {

	var addHash = function(newHash) {
		var temp = JSON.parse(localStorage.getItem('filters'));
		temp.push(newHash);
		localStorage.setItem('filters', JSON.stringify(temp));
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
		return JSON.parse(localStorage.getItem('filters'));
	};

	return {
		addHash: addHash,
		removeHash: removeHash,
		getHashes: getHashes
	};

})
.service('dateService', function() {
	var presetStart = "";
	var presetEnd = "";
	localStorage.setItem('presetStart', JSON.stringify(presetStart));
	localStorage.setItem('presetEnd', JSON.stringify(presetEnd));

	var addStart = function(newDate) {
		presetStart = newDate;
		localStorage.setItem('presetStart', JSON.stringify(newDate));
	}

	var removeStart = function() {
		localStorage.setItem('presetStart', JSON.stringify(""));
	}

	var addEnd = function(newDate) {
		presetEnd = newDate;
		localStorage.setItem('presetEnd', JSON.stringify(newDate));
	}

	var removeEnd = function() {
		localStorage.setItem('presetEnd', JSON.stringify(""));
	}

	var getStart = function() {
		return JSON.parse(localStorage.getItem('presetStart'));
	}

	var getEnd = function() {
		return JSON.parse(localStorage.getItem('presetEnd'));
	}

	return {
		addStart: addStart,
		removeStart: removeStart,
		addEnd: addEnd,
		removeEnd: removeEnd,
		getStart: getStart,
		getEnd: getEnd
	};
})
.service('validateService', function() {
	return {
		checkValid: function(item) {
			return (angular.isDefined(item) && item != "");	
		}
	};
})
.constant('urlPrefix', 'http://fleet.ord.cdk.com/storytellerconsumer/')
.controller('LinkController', function($scope, supersonic, $sce) {
	$scope.modLink = function(message) {
		// John Gruber's regex, modified for JS
		var regex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
		var modified = message.replace(regex, "<a onclick=\"supersonic.app.openURL('$1')\" href=\"\">$1</a>");
		return modified;
	}
});