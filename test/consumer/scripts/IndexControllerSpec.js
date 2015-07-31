describe("MessageController", function() {
	var scope, createController, controller, $httpBackend;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($rootScope, _supersonic_, $controller, $injector) {
		scope = $rootScope;
		$httpBackend = $injector.get('$httpBackend');
		createController = function() {
			return $controller('MessageController', {
				$scope: scope,
				supersonic: _supersonic_
			});
		};
		controller = createController();
	}));

	it("should initially not hide the spinner", function() {
		expect(scope.index.spinner).toBe(false);
	});

	it("should initially not have data", function() {
		expect(scope.allMsg).toBe(undefined);
	});

	it("should update the data properly", function(done) {
		$httpBackend.expectJSONP('http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK')
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

		scope.update()
			.then(function() {
				expect(scope.index.spinner).toBe(true);
				expect(Object.keys(scope.allMsg.messages).length).toBe(2);
			}, function() {
				expect(scope.index.spinner).toBe(false);
				expect(Object.keys(scope.allMsg.messages).length).toBe(0);
			}).finally(done);

		$httpBackend.flush();
	});
});

describe("SearchController", function() {
	var scope, createController, controller;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($rootScope, _supersonic_, $controller, $injector) {
		scope = $rootScope;
		$httpBackend = $injector.get('$httpBackend');
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

	it("", function() {

	});
});

describe("LinkController", function() {
	var scope, createController, controller, sce;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($rootScope, _supersonic_, $controller, $sce) {
		scope = $rootScope;
		sce = $sce;
		createController = function() {
			return $controller('LinkController', {
				$scope: scope,
				supersonic: _supersonic_,
				$sce: sce
			});
		};
		controller = createController();
	}));

	it("should modify links with schemes", function() {
		expect(sce.isEnabled()).toBe(true);

		var changedMessage = scope.modLink("http://www.reddit.com/");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("<a onclick=\"supersonic.app.openURL('http://www.reddit.com/')\" href=\"\">http://www.reddit.com/</a>");

		changedMessage = scope.modLink("abcd:///www.facebook.com");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("<a onclick=\"supersonic.app.openURL('abcd:///www.facebook.com')\" href=\"\">abcd:///www.facebook.com</a>");

		changedMessage = scope.modLink("http://foo.bar.baz");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("<a onclick=\"supersonic.app.openURL('http://foo.bar.baz')\" href=\"\">http://foo.bar.baz</a>");
	});

	it("should modify obvious links without schemes (like www.foo.com)", function() {
		var changedMessage = scope.modLink("www.bing.com");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("<a onclick=\"supersonic.app.openURL('www.bing.com')\" href=\"\">www.bing.com</a>");

		changedMessage = scope.modLink("www.reddit.com/r/ireland");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("<a onclick=\"supersonic.app.openURL('www.reddit.com/r/ireland')\" href=\"\">www.reddit.com/r/ireland</a>");
	});

	it("should only modify the link portion of a message", function() {
		var changedMessage = scope.modLink("hello world, this is the broken portal https://portal.adp.com/");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("hello world, this is the broken portal <a onclick=\"supersonic.app.openURL('https://portal.adp.com/')\" href=\"\">https://portal.adp.com/</a>");

		var changedMessage = scope.modLink("weird links still work abcd:///foo.bar.baz meow")
		expect(sce.getTrustedHtml(changedMessage)).toEqual("weird links still work <a onclick=\"supersonic.app.openURL('abcd:///foo.bar.baz')\" href=\"\">abcd:///foo.bar.baz</a> meow");
	});

	it("should not modify bad links", function() {
		var changedMessage = scope.modLink("h://foo.bar.baz");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("h://foo.bar.baz");

		changedMessage = scope.modLink("bing.com");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("bing.com");

		changedMessage = scope.modLink("portal.adp.com");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("portal.adp.com");

		changedMessage = scope.modLink("agar.io");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("agar.io");
	});

	it("should not modify plain text", function() {
		var changedMessage = scope.modLink("hello world, this is just a plain message");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("hello world, this is just a plain message");

		changedMessage = scope.modLink("");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("");
	});
});