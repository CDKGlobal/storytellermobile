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
		{name: "All time", value: "alltime"},
		{name: "1 month ago", value: "1mo"},
		{name: "2 months ago", value: "2mo"},
		{name: "3 months ago", value: "3mo"},
		{name: "6 months ago", value: "6mo"},
		{name: "1 year ago", value: "1yr"},
		{name: "2 years ago", value: "2yr"}
	];

	$scope.startDropdown = $scope.times[0];
});