angular
.module('SteroidsApplication', ['supersonic'])

.controller('MessageController', function($scope, supersonic, $http) {
	// ['supersonic'] is a dependency of SteroidsApplication
	$scope.getMsgs = function() {

		$http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK")
		.success(function(data, status, headers, config, scope) {
			supersonic.logger.log("Success! " + status);
			$scope.messages = data;
			$scope.apply;
		})
		.error(function(data, status, headers, config) {
			supersonic.logger.log("Error: " + status);
			$scope.wLat = "Error: no connection";
		});
	}

	setInterval($scope.getMsgs, 5000);
});

// .factory('IndexFactory', function IndexFactory ($http) {
// 	var exports = {};

// 	exports.getMessages = function () {
//      	return $http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSONP_CALLBACK")
//      	.success(function(data, status, headers, config) {
//      		supersonic.logger.log("Success in get request");
//      	})
//        	.error(function (data, status, headers, config) {
//             supersonic.logger.log("Error in http get request " + status);
//     	});
// 	};
//    return exports;
// })

// JUST USED:
// .module('MsgFactory', ['supersonic'])
// 	.factory('Msg', function($resource) {
// 		return $resource("http://fleet.ord.cdk.com/storytellerconsumer/messages", {}, {
// 			query: {method: 'GET', params: {}, isArray: true }
// 		});
// 	})
// 	.controller('IndexController', function($scope, supersonic) {

// 		// //['supersonic'] is a dependency of SteroidsApplication
// 		$scope.navbarTitle = "Consumer Application";

// 		function msgCtrl($scope, $timer, Msg) {
// 			$scope.msgs = [];

// 			(function tick() {
// 		        $scope.msgs = Msg.query(function() {
// 		            $timeout(tick, 1000);
// 		        });
// 		        supersonic.logger.log("tick");
// 		    })();
// 		};
// 	})


// .module('msgServices', ['ngResource']).factory('Msg', function ($resource) {
//     return $resource('http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK', {}, {
//         query: { method: 'GET', params: {}, isArray: true }
//     });
// })




// function msgCtrl($scope, $timeout, Msg) {
//     $scope.msgs = [];

//     (function tick() {
//         $scope.msgs = Msg.query(function() {
//         	$timeout(tick, 1000);
//         });
//     })();
// };





// .controller('IndexController', function($scope, supersonic, $http) {
// 		// //['supersonic'] is a dependency of SteroidsApplication
// 		$scope.navbarTitle = "Consumer Application";

// 		// function msgCtrl($scope, $timer, Msg) {
// 		// 	$scope.msgs = [];

// 			(function tick() {
// 				$http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK")
// 				.success(function(data, status, headers, config, scope) {
// 					supersonic.logger.log("Success! " + status);
// 					$scope.msgs = data;
// 				})
// 				.error(function(data, status, headers, config) {
// 					supersonic.logger.log("Error: " + status);
// 					$scope.wLat = "Error: no connection";
// 				});
// 		    })();
// 		// };



	// IndexFactory.getMessages()
	// 	.success(function(jsonData, statusCode) {
	// 		supersonic.logger.log("Success! " + statusCode);
	// 		$scope.messages = jsonData;
	// 	})
	// 	.error(function(jsonData, statusCode) {
	// 		supersonic.logger.log("Error: " + statusCode);
	// 	})

	// $scope.query = function () {
	// 	$http.jsonp("http://fleet.ord.cdk.com/storytellerconsumer/messages?callback=JSON_CALLBACK")
	// 		.success(function(data, status, headers, config, scope) {
	// 			supersonic.logger.log("Success! " + status);
	// 			$scope.wLat = "Latitude: " + data.latitude;
	// 			$scope.wLong = "Longitude: " + data.longitude;
	// 			$scope.wSum = "Currently " + angular.lowercase(data.currently.summary);
	// 			$scope.wMSum = data.minutely.summary;
	// 			$scope.wTemp = "Apparent Temperature: " + data.currently.apparentTemperature;
	// 			$scope.wPrec = "Chance of rain: " + data.currently.precipProbability;
	// 		})
	// 		.error(function(data, status, headers, config) {
	// 			supersonic.logger.log("Error: " + status);
	// 			$scope.wLat = "Error: no connection";
	// 		});
	// }


// });

// window.onload = function() {
// 	var target = document.getElementById("messages");
// 	window.setInterval(function() {
// 		var entry = document.createElement('li');
// 		entry.className = "item fadeIn";
// 		entry.appendChild(document.createTextNode("Fake message! " + Math.random()));
// 		target.insertBefore(entry, target.childNodes[0]);
// 	}, 15000);
// }