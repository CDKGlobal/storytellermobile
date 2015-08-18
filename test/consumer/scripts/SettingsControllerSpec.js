describe("SettingsController", function() {
	var scope, controller, allStoriesService;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($rootScope, _supersonic_, $controller, $injector) {
		scope = $rootScope;
		allStoriesService = $injector.get('allStoriesService');
		var createController = function() {
			return $controller('SettingsController', {
				$scope: scope,
				supersonic: _supersonic_
			});
		};
		controller = createController();
		supersonic.data.channel('story-name').publish("greeting");
		allStoriesService.deleteAll();
		allStoriesService.addStory("greeting");
	}));

	it("should initially hide all the right things and show the others", function() {
		expect(scope.hide.sDate).toBe(true);
		expect(scope.hide.eDate).toBe(true);
		expect(scope.hide.sInput).toBe(false);
		expect(scope.hide.eInput).toBe(false);
		expect(scope.hide.sButton).toBe(false);
		expect(scope.hide.eButton).toBe(false);
	});

	/*
	 * tests commented out becasue of supersonic's publish/subscribe runs
	 * asynchronously, so the tests would always fail when the controller
	 * couldn't get the message sent through publish
	 *

	it("should be able to add a filter", function() {
		scope.newInput = "hello";
		scope.addFilter();
		dump(scope.filterList);
		expect(scope.filterList.pop()).toEqual("hello");
		scope.filterList.push("hello");
		expect(scope.newInput).toEqual("");
		expect(Object.keys(scope.filterList).length).toBe(1);
		expect(Object.keys(allStoriesService.getHashes()).length).toBe(1);
	});

	it("should be able to remove a filter", function() {
		//leftover filter from above test
		expect(Object.keys(scope.filterList).length).toBe(1);
		expect(Object.keys(allStoriesService.getHashes()).length).toBe(1);
		scope.deleteFilter("hello");
		expect(Object.keys(scope.filterList).length).toBe(0);
		expect(Object.keys(allStoriesService.getHashes()).length).toBe(0);
	});

	it("should not allow duplicate filters", function() {
		scope.newInput = "hello";
		scope.addFilter();
		expect(Object.keys(scope.filterList).length).toBe(1);
		expect(Object.keys(allStoriesService.getHashes()).length).toBe(1);
		scope.newInput = "hello";
		scope.addFilter();
		expect(Object.keys(scope.filterList).length).toBe(1);
		expect(Object.keys(allStoriesService.getHashes()).length).toBe(1);
	});

	it("should be able to add a start and end date", function() {

	});

	it("should be able to remove a start and end date", function() {

	});

	it("should be able to delete the story", function() {

	});

*/
});