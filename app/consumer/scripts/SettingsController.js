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

	// $scope.addStartDate = function() {
	// 	if(validateService.checkValid($scope.startDateInput)) {
	// 		dateService.addStart($scope.startDateInput);
	// 		$scope.dateSet.startDate = $scope.startDateInput;
	// 		// show p, hide input and checkmark
	// 		$scope.hide.sDate = false;
	// 		$scope.hide.sInput = true;
	// 		$scope.hide.sButton = true;
	// 		$scope.startDateInput = "";
	// 	}
	// }

	// $scope.deleteStartDate = function(toDelete) {
	// 	if($scope.hide.sDate === false) {
	// 		dateService.removeStart();
	// 		$scope.hide.sDate = true;
	// 		$scope.hide.sInput = false;
	// 		$scope.hide.sButton = false;
	// 	}
	// }

	// $scope.addEndDate = function() {
	// 	if(validateService.checkValid($scope.endDateInput)) {
	// 		dateService.addEnd($scope.endDateInput);
	// 		$scope.dateSet.endDate = $scope.endDateInput;
	// 		$scope.hide.eDate = false;
	// 		$scope.hide.eInput = true;
	// 		$scope.hide.eButton = true;
	// 		$scope.endDateInput = "";
	// 	}
	// }

	// $scope.deleteEndDate = function() {
	// 	if($scope.hide.eDate === false) {
	// 		dateService.removeEnd();
	// 		$scope.hide.eDate = true;
	// 		$scope.hide.eInput = false;
	// 		$scope.hide.eButton = false;
	// 	}
	// }
})