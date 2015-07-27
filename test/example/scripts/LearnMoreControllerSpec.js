describe("LearnMoreController", function() {

	var scope, createController;

	beforeEach(angular.mock.module("example", "supersonic"));

	beforeEach(angular.mock.inject (function ($rootScope, _supersonic_, $controller) {
		scope = $rootScope;

		createController = function() {
			return $controller('LearnMoreController', {
				$scope: scope,
				supersonic: _supersonic_
			});
		};
	}));

	it("should set the navbarTitle", function() {
		var controller = createController();
		expect(scope.navbarTitle).toEqual("Learn More");
	});
});