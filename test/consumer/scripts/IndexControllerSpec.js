describe("filterService", function() {
	var filterService;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($injector) {
		filterService = $injector.get('filterService');
	}));

	it("should add hashes without failing", function() {
		filterService.addHash("hello");
		filterService.addHash("hey");
		filterService.addHash("hi");
		filterService.addHash("howdy");
		expect(Object.keys(filterService.getHashes()).length).toBe(4);
	});

	it("should get hashes without failing", function() {
		expect(filterService.getHashes().indexOf("hello")).not.toBe(-1);
		expect(filterService.getHashes().indexOf("hey")).not.toBe(-1);
		expect(filterService.getHashes().indexOf("hi")).not.toBe(-1);
		expect(filterService.getHashes().indexOf("howdy")).not.toBe(-1);
	});

	it("should remove hashes without failing", function() {
		filterService.removeHash("hello");
		filterService.removeHash("hey");
		filterService.removeHash("hi");
		filterService.removeHash("howdy");
	});

	it("should create the array of filters if it doesn't already exist", function() {
		localStorage.removeItem('filters');
		expect(localStorage.getItem('filters')).toBe(null);
		expect(filterService.getHashes()).not.toBe(null);
		expect(localStorage.getItem('filters')).not.toBe(null);

		localStorage.removeItem('filters');
		expect(localStorage.getItem('filters')).toBe(null);
		filterService.addHash("hello");
		expect(localStorage.getItem('filters')).not.toBe(null);
		filterService.removeHash("hello");
		expect(localStorage.getItem('filters')).not.toBe(null);
	});

	it("should not let multiple of the same hashes be added", function() {
		filterService.addHash("hello");
		filterService.addHash("hello");
		filterService.addHash("hello");
		expect(localStorage.getItem('filters')).not.toBe(null);
		expect(Object.keys(filterService.getHashes()).length).toBe(1);
		filterService.removeHash("hello");
	});
});

describe("dateService", function() {
	var dateService;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($injector) {
		dateService = $injector.get('dateService');
	}));

	it("should get and set the start start property without fail", function() {
		var start = "start";
		dateService.setStart(start);
		expect(dateService.getStart()).toBe(start);
	});
});

describe("validateService", function() {
	var validateService;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($injector) {
		validateService = $injector.get('validateService');
	}));

	it("should not validate incorrect stuff", function() {
		var hello;
		expect(validateService.checkValid(hello)).toBe(false);
		expect(validateService.checkValid("")).toBe(false);

		hello = "";
		expect(validateService.checkValid(hello)).toBe(false);

		hello = "hello";

		expect(validateService.checkValid(hello)).toBe(true);
		expect(validateService.checkValid("hello")).toBe(true);
	});
});

describe("LinkController", function() {
	var scope, createController, controller;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($rootScope, _supersonic_, $controller) {
		scope = $rootScope;
		createController = function() {
			return $controller('LinkController', {
				$scope: scope,
				supersonic: _supersonic_,
			});
		};
		controller = createController();
	}));

	it("should modify links with schemes", function() {
		var changedMessage = scope.modLink("http://www.reddit.com/");
		expect(changedMessage).toEqual("<a onclick=\"supersonic.app.openURL('http://www.reddit.com/')\" href=\"\">http://www.reddit.com/</a>");

		changedMessage = scope.modLink("abcd:///www.facebook.com");
		expect(changedMessage).toEqual("<a onclick=\"supersonic.app.openURL('abcd:///www.facebook.com')\" href=\"\">abcd:///www.facebook.com</a>");

		changedMessage = scope.modLink("http://foo.bar.baz");
		expect(changedMessage).toEqual("<a onclick=\"supersonic.app.openURL('http://foo.bar.baz')\" href=\"\">http://foo.bar.baz</a>");
	});

	it("should modify obvious links without schemes (like www.foo.com)", function() {
		var changedMessage = scope.modLink("www.bing.com");
		expect(changedMessage).toEqual("<a onclick=\"supersonic.app.openURL('www.bing.com')\" href=\"\">www.bing.com</a>");

		changedMessage = scope.modLink("www.reddit.com/r/ireland");
		expect(changedMessage).toEqual("<a onclick=\"supersonic.app.openURL('www.reddit.com/r/ireland')\" href=\"\">www.reddit.com/r/ireland</a>");
	});

	it("should only modify the link portion of a message", function() {
		var changedMessage = scope.modLink("hello world, this is the broken portal https://portal.adp.com/");
		expect(changedMessage).toEqual("hello world, this is the broken portal <a onclick=\"supersonic.app.openURL('https://portal.adp.com/')\" href=\"\">https://portal.adp.com/</a>");

		var changedMessage = scope.modLink("weird links still work abcd:///foo.bar.baz meow")
		expect(changedMessage).toEqual("weird links still work <a onclick=\"supersonic.app.openURL('abcd:///foo.bar.baz')\" href=\"\">abcd:///foo.bar.baz</a> meow");
	});

	it("should not modify bad links", function() {
		var changedMessage = scope.modLink("h://foo.bar.baz");
		expect(changedMessage).toEqual("h://foo.bar.baz");

		changedMessage = scope.modLink("bing.com");
		expect(changedMessage).toEqual("bing.com");

		changedMessage = scope.modLink("portal.adp.com");
		expect(changedMessage).toEqual("portal.adp.com");

		changedMessage = scope.modLink("agar.io");
		expect(changedMessage).toEqual("agar.io");
	});

	it("should not modify plain text", function() {
		var changedMessage = scope.modLink("hello world, this is just a plain message");
		expect(changedMessage).toEqual("hello world, this is just a plain message");

		changedMessage = scope.modLink("");
		expect(changedMessage).toEqual("");
	});
});