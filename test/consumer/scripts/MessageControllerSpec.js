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