describe("allStoriesService", function() {
	var allStoriesService;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($injector) {
		allStoriesService = $injector.get('allStoriesService');
	}));

	it("should add (non-duplicate) stories without failing", function() {
		expect(allStoriesService.getStories()).toBe(null);
		allStoriesService.addStory("test");
		allStoriesService.addStory("test"); //shouldn't add this
		allStoriesService.addStory("greetings", "hello");
		allStoriesService.addStory("Chevy", "Chevrolet");
		expect(Object.keys(allStoriesService.getStories()).length).toBe(3);
	});

	it("should get stories without failing", function() {
		expect(Object.keys(allStoriesService.getStories()).length).toBe(3);
		expect(allStoriesService.getStories()[0].name).toBe("test");
		expect(allStoriesService.getStories()[1].name).toBe("greetings");
		expect(allStoriesService.getStories()[2].name).toBe("Chevy");
	});

	it("should add (non-duplicate) hashes without failing", function() {
		allStoriesService.addHash("greetings", "hello");	//should be duplicate
		allStoriesService.addHash("greetings", "hey");
		allStoriesService.addHash("greetings", "hi");
		allStoriesService.addHash("greetings", "howdy");
		expect(Object.keys(allStoriesService.getHashes("greetings")).length).toBe(4);
	});

	it("should get hashes without failing", function() {
		expect(allStoriesService.getHashes("greetings").indexOf("hello")).not.toBe(-1);
		expect(allStoriesService.getHashes("greetings").indexOf("hey")).not.toBe(-1);
		expect(allStoriesService.getHashes("greetings").indexOf("hi")).not.toBe(-1);
		expect(allStoriesService.getHashes("greetings").indexOf("howdy")).not.toBe(-1);
	});

	it("should remove hashes without failing", function() {
		allStoriesService.deleteHash("greetings", "hello");
		allStoriesService.deleteHash("greetings", "hey");
		allStoriesService.deleteHash("greetings", "hi");
		allStoriesService.deleteHash("greetings", "howdy");
	});

	it("should remove stories without failing", function() {
		expect(Object.keys(allStoriesService.getStories()).length).toBe(3);
		allStoriesService.deleteStory("greetings");
		allStoriesService.deleteStory("test");
		allStoriesService.deleteStory("Chevy");
		expect(Object.keys(allStoriesService.getStories()).length).toBe(0);
	});
});

describe("dateService", function() {
	var dateService;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($injector) {
		dateService = $injector.get('dateService');
	}));

	it("should subtract the right number of months from today's date", function() {
		//this test will NOT work unless you modify the expected dates
		//currently the dates are set assuming that today is 2015-8-17

		var date = dateService.subtractMonths(0);
		expect(date).toBe(null);

		date = dateService.subtractMonths(1);
		expect(date).toEqual("2015-7-18");

		date = dateService.subtractMonths(2);
		expect(date).toEqual("2015-6-18");

		date = dateService.subtractMonths(3);
		expect(date).toEqual("2015-5-18");

		date = dateService.subtractMonths(4);
		expect(date).toEqual("2015-2-18");
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

		var changedMessage = scope.modLink("<a href='http://www.reddit.com/'>reddit</a>");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("<a onclick=\"supersonic.app.openURL('http://www.reddit.com/')\" href=\"\">reddit</a>");

		changedMessage = scope.modLink("<a href='abcd:///www.facebook.com'>facebook</a>");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("<a onclick=\"supersonic.app.openURL('abcd:///www.facebook.com')\" href=\"\">facebook</a>");

		changedMessage = scope.modLink("<a href='http://foo.bar.baz'>foobar</a>");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("<a onclick=\"supersonic.app.openURL('http://foo.bar.baz')\" href=\"\">foobar</a>");
	});

	it("should modify obvious links without schemes (like www.foo.com)", function() {
		var changedMessage = scope.modLink("<a href='www.bing.com'>bing</a>");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("<a onclick=\"supersonic.app.openURL('www.bing.com')\" href=\"\">bing</a>");

		changedMessage = scope.modLink("<a href='www.reddit.com/r/ireland'>reddit</a>");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("<a onclick=\"supersonic.app.openURL('www.reddit.com/r/ireland')\" href=\"\">reddit</a>");
	});

	it("should only modify the link portion of a message", function() {
		var changedMessage = scope.modLink("hello world, this is the portal <a href='https://portal.adp.com/'>portal</a>");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("hello world, this is the portal <a onclick=\"supersonic.app.openURL('https://portal.adp.com/')\" href=\"\">portal</a>");

		var changedMessage = scope.modLink("weird links still work <a href='abcd:///foo.bar.baz'>foobar</a> meow")
		expect(sce.getTrustedHtml(changedMessage)).toEqual("weird links still work <a onclick=\"supersonic.app.openURL('abcd:///foo.bar.baz')\" href=\"\">foobar</a> meow");
	});

	it("should not modify links without anchor tags", function() {
		var changedMessage = scope.modLink("www.bing.com this won't be clickable");
		expect(sce.getTrustedHtml(changedMessage)).toEqual("www.bing.com this won't be clickable");
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

describe("DrawerController", function() {
	var scope, createController, controller, allStoriesService;

	beforeEach(angular.mock.module("consumer", "supersonic"));

	beforeEach(angular.mock.inject (function ($rootScope, _supersonic_, $controller, $injector) {
		scope = $rootScope;
		createController = function() {
			return $controller('DrawerController', {
				$scope: scope,
				supersonic: _supersonic_,
			});
		};
		controller = createController();
		allStoriesService = $injector.get('allStoriesService');
	}));

	it("should be able to delete all data", function() {
		expect(Object.keys(allStoriesService.getStories()).length).toBe(0);
		allStoriesService.addStory("greetings", "hello,hi,howdy");
		allStoriesService.addStory("test");
		expect(Object.keys(allStoriesService.getStories()).length).toBe(2);
		scope.deleteAll();
		expect(Object.keys(allStoriesService.getStories()).length).toBe(0);
	});
});