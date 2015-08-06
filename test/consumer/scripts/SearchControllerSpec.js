describe("SearchController", function() {
	var scope, createController, controller, filterService, validateService;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($rootScope, _supersonic_, $controller, $injector) {
		scope = $rootScope;
		$httpBackend = $injector.get('$httpBackend');
		filterService = $injector.get('filterService');
		validateService = $injector.get('validateService');
		createController = function() {
			return $controller('SearchController', {
				$scope: scope,
				supersonic: _supersonic_
			});
		};
		controller = createController();
	}));

	it("should initially hide 3 elements", function() {
		expect(scope.found.none).toBe(true);
		expect(scope.hideMoreButton).toBe(true);
		expect(scope.noMore).toBe(true);
	});

	it("should behave properly when search results are found", function(done) {
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
						"TNUE", "testing", "hello"
					],
					"message": "this is a message"
		}]});
		scope.searchAll(15)
			.then(function() {
				expect(Object.keys(scope.allResults.messages).length).toBe(2);
				expect(scope.found.none).toBe(true);
				expect(scope.hideMoreButton).toBe(true);
				expect(scope.noMore).toBe(false);
			}).finally(done);
		$httpBackend.flush();
	});

	it("should behave properly when more search results can be found", function(done) {
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/records?count=2&callback=JSON_CALLBACK')
			.respond({
				"messages": [{
					"userId": "test_userid",
					"timeStamp": "Fri Jul 24 16:14:33 GMT 2015",
					"hashtags": [
						"TNUE", "testing", "hello"
					],
					"message": "this is a message 1"
				}, {
					"userId": "test_userid",
					"timeStamp": "Fri Jul 24 16:14:33 GMT 2015",
					"hashtags": [
						"TNUE", "testing", "hello"
					],
					"message": "this is a message 2"
		}]});
		scope.searchAll(2)
			.then(function() {
				expect(Object.keys(scope.allResults.messages).length).toBe(2);
				expect(scope.found.none).toBe(true);
				expect(scope.hideMoreButton).toBe(false);
				expect(scope.noMore).toBe(true);
			}).finally(done);
		$httpBackend.flush();
	})

	it("should behave properly when search results aren't found", function(done) {
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/records?count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});
		scope.searchAll(15)
			.then(function() {
				expect(Object.keys(scope.allResults.messages).length).toBe(0);
				expect(scope.found.none).toBe(false);
				expect(scope.hideMoreButton).toBe(true);
				expect(scope.noMore).toBe(true);
			}).finally(done);
		$httpBackend.flush();
	});

	it("should use the records? URL if the user fills in no fields", function() {
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/records?count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});
		scope.searchAll(15);
		$httpBackend.flush();
	});

	it("should use the search? URL if keywords are given", function() {
		scope.search = {keywords: "hello"};
		expect(validateService.checkValid(scope.search)).toBe(true);
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/search?query=hello&count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});
		scope.searchAll(15);
		$httpBackend.flush();

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
	});

	it("should use the time? URL if only dates are given", function() {
		scope.search = {startdate: "2015-08-01"};
		expect(validateService.checkValid(scope.search)).toBe(true);
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/time?start=2015-08-01&count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});
		scope.searchAll(15);
		$httpBackend.flush();

		scope.search.startdate = "";
		scope.search.enddate = "2015-08-02";
		expect(validateService.checkValid(scope.search)).toBe(true);
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/time?end=2015-08-02&count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});
		scope.searchAll(15);
		$httpBackend.flush();

		scope.search.startdate = "2015-08-01";
		expect(validateService.checkValid(scope.search)).toBe(true);
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/time?start=2015-08-01&end=2015-08-02&count=15&callback=JSON_CALLBACK')
			.respond({
				"messages": []
		});
		scope.searchAll(15);
		$httpBackend.flush();
	});
});