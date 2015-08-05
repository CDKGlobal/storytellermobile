angular.module('consumer', ['common'])
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
.constant('urlPrefix', 'http://fleet.ord.cdk.com/storytellerconsumer/')
.controller('LinkController', function($scope, supersonic) {
	$scope.modLink = function(message) {
		// John Gruber's regex, modified for JS
		var regex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
		var modified = message.replace(regex, "<a onclick=\"supersonic.app.openURL('$1')\" href=\"\">$1</a>");
		return modified;
	}
});