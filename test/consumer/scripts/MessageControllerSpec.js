describe("MessageController", function() {
	var scope, createController, controller, $httpBackend, increaseAmount, allStoriesService;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($rootScope, _supersonic_, _increaseAmount_, $controller, $injector) {
		scope = $rootScope;
		$httpBackend = $injector.get('$httpBackend');
		allStoriesService = $injector.get('allStoriesService');
		increaseAmount = _increaseAmount_;
		createController = function() {
			return $controller('MessageController', {
				$scope: scope,
				supersonic: _supersonic_,
				increaseAmount: _increaseAmount_
			});
		};
		controller = createController();
		supersonic.data.channel('story-name').publish("test");
		allStoriesService.addStory("test");
	}));

	it("should initially hide the right elements", function() {
		expect(scope.index.spinner).toBe(false);
		expect(scope.stories.hide).toBe(true);
		expect(scope.hideMoreButton).toBe(true);
		expect(scope.noMore).toBe(true);
	});

	it("should initially not have data", function() {
		expect(scope.allMsg).toBe(undefined);
	});

	it("should update the data properly when results are found", function(done) {
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/records?count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": [{
					"userId": "test_userid",
					"timeStamp": "Wed Jul 22 16:42:13 GMT 2015",
					"hashtags": [
						"TNUE", "tags"
					],
					"message": "hello world"
				}, {
					"userId": "test_userid",
					"timeStamp": "Fri Jul 24 16:14:33 GMT 2015",
					"hashtags": [
						"TNUE", "testing"
					],
					"message": "this is a message"
		}]});

		scope.update(increaseAmount)
			.then(function() {
				expect(scope.index.spinner).toBe(true);
				expect(scope.stories.hide).toBe(false);
				expect(scope.hideMoreButton).toBe(true);
				expect(scope.noMore).toBe(false);
				expect(Object.keys(scope.allMsg.messages).length).toBe(2);
			}, function() {
				expect(scope.index.spinner).toBe(false);
				expect(Object.keys(scope.allMsg.messages).length).toBe(0);
			}).finally(done);

		$httpBackend.flush();
	});

	it("should update the data properly when more results can be found", function(done) {
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/records?count=2&callback=JSON_CALLBACK')
			.respond({
				"messages": [{
					"userId": "test_userid",
					"timeStamp": "Wed Jul 22 16:42:13 GMT 2015",
					"hashtags": [
						"TNUE", "tags"
					],
					"message": "hello world"
				}, {
					"userId": "test_userid",
					"timeStamp": "Fri Jul 24 16:14:33 GMT 2015",
					"hashtags": [
						"TNUE", "testing"
					],
					"message": "this is a message"
		}]});

		scope.update(2)
			.then(function() {
				expect(scope.index.spinner).toBe(true);
				expect(scope.stories.hide).toBe(false);
				expect(scope.hideMoreButton).toBe(false);
				expect(scope.noMore).toBe(true);
				expect(Object.keys(scope.allMsg.messages).length).toBe(2);
			}, function() {
				expect(scope.index.spinner).toBe(false);
				expect(Object.keys(scope.allMsg.messages).length).toBe(0);
			}).finally(done);

		$httpBackend.flush();
	});

	it("should update properly when no results can be found", function(done) {
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/records?count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});

		scope.update(15)
			.then(function() {
				expect(scope.index.spinner).toBe(true);
				expect(scope.stories.hide).toBe(false);
				expect(scope.hideMoreButton).toBe(true);
				expect(scope.noMore).toBe(false);
				expect(Object.keys(scope.allMsg.messages).length).toBe(2);
			}, function() {
				expect(scope.index.spinner).toBe(false);
				expect(Object.keys(scope.allMsg.messages).length).toBe(0);
			}).finally(done);
	});

	it("should use the records? URL if the user fills in no fields", function() {
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/records?count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});
		scope.update(15);
		$httpBackend.flush();
	});

	it("should use the search? URL if filters are given", function(done) {
		allStoriesService.addHash("test", "hello");
		dump("hashes: " + allStoriesService.getHashes("test"));
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/search?query=hello&count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});
		scope.update(15)
			.then(function() {

			}, function() {

			})
			.finally(done);
		$httpBackend.flush();

		/*
		scope.search.startdate = "2015-08-01";
		expect(validateService.checkValid(scope.search)).toBe(true);
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/search?query=hello&start=2015-08-01&count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});
		scope.searchAll(15);
		$httpBackend.flush();

		scope.search.startdate = "";
		scope.search.enddate = "2015-08-02";
		expect(validateService.checkValid(scope.search)).toBe(true);
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/search?query=hello&end=2015-08-02&count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});
		scope.searchAll(15);
		$httpBackend.flush();

		scope.search.startdate = "2015-08-01";
		expect(validateService.checkValid(scope.search)).toBe(true);
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/search?query=hello&start=2015-08-01&end=2015-08-02&count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});
		scope.searchAll(15);
		$httpBackend.flush();
		*/
	});
});