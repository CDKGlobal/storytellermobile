angular.module('consumer')
.controller('SettingsController', function($scope, supersonic, filterService, dateService, validateService) {
	//initialize all the hides up here...
	$scope.hide = {sDate: true};
	$scope.hide = {eDate: true};
	$scope.hide = {sInput: false};
	$scope.hide = {eInput: false};
	$scope.hide = {sButton: false};
	$scope.hide = {eButton: false};
	$scope.dateSet = [];

	// for the view
	$scope.filterList = filterService.getHashes();

	$scope.addFilter = function() {
		var newFilter = $scope.newInput;

		if(angular.isDefined(newFilter) && newFilter != "") {
			$scope.filterList.push(newFilter);
			$scope.newInput = "";
			filterService.addHash(newFilter);
			console.log(filterService.getHashes());
		}
	}

	$scope.deleteFilter = function(toDelete) {
		var index = $scope.filterList.indexOf(toDelete);
		if (index > -1) {
			$scope.filterList.splice(index, 1);
		}
		filterService.removeHash(toDelete);
		console.log(filterService.getHashes());
	}

	$scope.times = [
		{name: "All time", id: "0"},
		{name: "1 month ago", id: "1"},
		{name: "2 months ago", id: "2"},
		{name: "3 months ago", id: "3"},
		{name: "6 months ago", id: "4"},
		{name: "1 year ago", id: "5"},
		{name: "2 years ago", id: "6"}
	];

	if(validateService.checkValid(dateService.getStart())) {
		$scope.startDropdown = $scope.times[parseInt(dateService.getStart())];
	} else {
		$scope.startDropdown = $scope.times[0];
	}
	$scope.changedDate = function(item) {
		console.log(item.id);
		dateService.setStart(item.name);
	}
});