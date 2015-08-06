describe("SettingsController", function() {
	var scope, createController, controller, filterService;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($rootScope, _supersonic_, $controller, $injector) {
		scope = $rootScope;
		filterService = $injector.get('filterService');
		createController = function() {
			return $controller('SettingsController', {
				$scope: scope,
				supersonic: _supersonic_
			});
		};
		controller = createController();
	}));

	it("should initially hide all the right things and show the others", function() {
		expect(scope.hide.sDate).toBe(true);
		expect(scope.hide.eDate).toBe(true);
		expect(scope.hide.sInput).toBe(false);
		expect(scope.hide.eInput).toBe(false);
		expect(scope.hide.sButton).toBe(false);
		expect(scope.hide.eButton).toBe(false);
	});

	it("should be able to add a filter", function() {
		expect(Object.keys(scope.filterList).length).toBe(0);
		scope.newInput = "hello";
		scope.addFilter();
		expect(scope.filterList.pop()).toEqual("hello");
		scope.filterList.push("hello");
		expect(scope.newInput).toEqual("");
		expect(Object.keys(scope.filterList).length).toBe(1);
		expect(Object.keys(filterService.getHashes()).length).toBe(1);
	});

	it("should be able to remove a filter", function() {
		//leftover filter from above test
		expect(Object.keys(scope.filterList).length).toBe(1);
		expect(Object.keys(filterService.getHashes()).length).toBe(1);
		scope.deleteFilter("hello");
		expect(Object.keys(scope.filterList).length).toBe(0);
		expect(Object.keys(filterService.getHashes()).length).toBe(0);
	});

	it("should not allow duplicate filters", function() {
		scope.newInput = "hello";
		scope.addFilter();
		expect(Object.keys(scope.filterList).length).toBe(1);
		expect(Object.keys(filterService.getHashes()).length).toBe(1);
		scope.newInput = "hello";
		scope.addFilter();
		expect(Object.keys(scope.filterList).length).toBe(1);
		expect(Object.keys(filterService.getHashes()).length).toBe(1);
	});

	it("should be able to add a start and end date", function() {

	});

	it("should be able to remove a start and end date", function() {

	});
});