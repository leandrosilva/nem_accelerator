// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nem_accelerator', ['ionic'])

.controller('CarController', function($scope, $interval) {
  var accelerate;
  var decelerate;
  var breaking;
  var gasControl;
	var arrowBlinker;

  $scope.car = {
    engineIsOn: false,
    speed: 0,
    speedometer: '---',
    gasLevel: 80,
    gasLevelIsHigh: true,
    gasLevelIsHalf: false,
    gasLevelIsLow: false,
    gasLevelIsEmpty: false
  };

  $scope.ignition = function() {
    if ($scope.car.speed > 0) {
      return;
    }

    $scope.car.engineIsOn = !($scope.car.engineIsOn);
    $scope.car.speed = 0;

    if ($scope.car.engineIsOn) {
      $scope.car.speedometer = $scope.car.speed;

      gasControl = $interval(function() {
        if ($scope.car.gasLevel > 0) {
          $scope.car.gasLevel = $scope.car.gasLevel -5;
          $scope.gasLevelWatcher();
        }
      }, 1*(1000*60));
    } else {
      $scope.car.speedometer = '---';
      $interval.cancel(gasControl);
    }

    $scope.gasLevelWatcher();
		$scope.resetArrowBlinker();
  };

  $scope.pushAccelerator = function() {
    if ($scope.car.engineIsOn) {
      if (decelerate != undefined) {
        $interval.cancel(decelerate);
      }

      accelerate = $interval(function() {
        if ($scope.car.speed < 260) {
          var percent;

          if ($scope.car.speed < 30) {
            percent = 0.1;
          } else if ($scope.car.speed < 50) {
            percent = 0.05;
          } else if ($scope.car.speed < 80) {
            percent = 0.02;
          } else {
            percent = 0.0;
          }

          $scope.car.speed = $scope.car.speed + 1 + Math.round($scope.car.speed * percent);

          if ($scope.car.speed > 260) {
            $scope.car.speed = 260;
          }

          $scope.car.speedometer = $scope.car.speed.toString();
        }
      }, 150);
    }
  };

  $scope.releaseAccelerator = function() {
    if ($scope.car.engineIsOn) {
      if (accelerate != undefined) {
        $interval.cancel(accelerate);
      }

      decelerate = $interval(function() {
        if ($scope.car.speed > 0) {
          var percent = 0.0;

          if (breaking) {
            if ($scope.car.speed < 30) {
              percent = 0.25;
            } else if ($scope.car.speed < 50) {
              percent = 0.2;
            } else if ($scope.car.speed < 80) {
              percent = 0.15;
            } else {
              percent = 0.1;
            }
          }

          $scope.car.speed = $scope.car.speed - 1 - Math.round($scope.car.speed * percent);
          $scope.car.speedometer = $scope.car.speed.toString();
        } else {
          $interval.cancel(decelerate);
        }
      }, 220);
    }
  };

  $scope.keepAcceleration = function() {
    if ($scope.car.engineIsOn && $scope.car.speed > 0) {
      if (decelerate != undefined) {
        $interval.cancel(decelerate);
      }
    }
  }

  $scope.pushBreaker = function() {
    breaking = true;
  }

  $scope.releaseBreaker = function() {
    breaking = false;
  }

  $scope.gasLevelWatcher = function() {
    if ($scope.car.engineIsOn) {
      if ($scope.car.gasLevel > 75) {
        $scope.car.gasLevelIsHigh = true;
        $scope.car.gasLevelIsHalf = false;
        $scope.car.gasLevelIsLow = false;
        $scope.car.gasLevelIsEmpty = false;
      } else if ($scope.car.gasLevel >= 50 && $scope.car.gasLevel < 75) {
        $scope.car.gasLevelIsHigh = false;
        $scope.car.gasLevelIsHalf = true;
        $scope.car.gasLevelIsLow = false;
        $scope.car.gasLevelIsEmpty = false;
      } else if ($scope.car.gasLevel >= 25 && $scope.car.gasLevel < 50) {
        $scope.car.gasLevelIsHigh = false;
        $scope.car.gasLevelIsHalf = false;
        $scope.car.gasLevelIsLow = true;
        $scope.car.gasLevelIsEmpty = false;
      } else if ($scope.car.gasLevel >= 0 && $scope.car.gasLevel < 25) {
        $scope.car.gasLevelIsHigh = false;
        $scope.car.gasLevelIsHalf = false;
        $scope.car.gasLevelIsLow = false;
        $scope.car.gasLevelIsEmpty = true;
      }
    } else {
      $scope.car.gasLevelIsHigh = false;
      $scope.car.gasLevelIsHalf = false;
      $scope.car.gasLevelIsLow = false;
      $scope.car.gasLevelIsEmpty = false;
    }
  }

  $scope.gasLevelWatcher();

  $scope.refillGas = function() {
    $scope.car.gasLevel = 100;
		
  	$interval(function() {
	    $scope.car.gasLevelIsHigh = !$scope.car.gasLevelIsHigh;
		}, 1*(10*60), 6);
  }

	$scope.resetArrowBlinker = function() {
		$interval.cancel(arrowBlinker);
    arrowBlinker = undefined;

  	$scope.car.isLeftArrow = false;
    $scope.car.isRightArrow = false;
	}

  $scope.blinkArrowLeft = function() {
    if ($scope.car.engineIsOn) {
      if (arrowBlinker == undefined) {
        $scope.resetArrowBlinker();

        arrowBlinker = $interval(function() {
          $scope.car.isLeftArrow = !$scope.car.isLeftArrow;
          $scope.car.isRightArrow = false;
        }, 1*(10*60));
      } else {
        $scope.resetArrowBlinker();
      }
    }
  };

  $scope.blinkArrowRight = function() {
    if ($scope.car.engineIsOn) {
      if (arrowBlinker == undefined) {
        $scope.resetArrowBlinker();

  	  	arrowBlinker = $interval(function() {
  	      $scope.car.isRightArrow = !$scope.car.isRightArrow;
  	    	$scope.car.isLeftArrow = false;
  			}, 1*(10*60), 10);
      } else {
        $scope.resetArrowBlinker();
      }
    }
  };
	
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
