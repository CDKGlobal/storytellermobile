angular.module('consumer')
.controller('SettingsController', function($scope, supersonic, filterService, dateService, validateService) {
	//initialize all the hides up here...
	$scope.hide = {
		sDate: true,
		eDate: true,
		sInput: false,
		eInput: false,
		sButton: false,
		eButton: false
	};

	// for the view
	$scope.filterList = filterService.getHashes();

	$scope.addFilter = function() {
		var newFilter = $scope.newInput;

		if(angular.isDefined(newFilter) && newFilter != "") {
			$scope.newInput = "";
			filterService.addHash(newFilter);
			$scope.filterList = filterService.getHashes();
		}
	}

	$scope.deleteFilter = function(toDelete) {
		filterService.removeHash(toDelete);
		$scope.filterList = filterService.getHashes();
	}

	$scope.times = [
		{name: "All time", id: "0"},
		{name: "1 month ago", id: "1"},
		{name: "2 months ago", id: "2"},
		{name: "3 months ago", id: "3"},
		{name: "6 months ago", id: "4"}
	];

	if(validateService.checkValid(dateService.getStart())) {
		$scope.startDropdown = $scope.times[parseInt(dateService.getStart())];
	} else {
		$scope.startDropdown = $scope.times[0];
	}

	$scope.changedDate = function(item) {
		dateService.setStart(item.name);
	}
});