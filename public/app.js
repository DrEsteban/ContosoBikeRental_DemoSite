var app = angular.module('myApp', ['ngRoute']);

app.controller('MainController', function($scope, $http) {

    $scope.messages = [];
    $scope.getAvailableBikes = function() {
        $http.get("/api/availableBikes").then(function(response) {
            $scope.messages.push("Available bikes: " + JSON.stringify(response.data));
        }, function(response) {
            $scope.messages.push("Couldn't get available bikes: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
        });
    };
    $scope.getAvailableBikes();

    $scope.bikeId = "";
    $scope.myBikes = [];
    var bikeReservationInner = function(response) {
        $scope.messages.push(response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
        $scope.getAvailableBikes();
    }
    $scope.reserveBike = function() {
        $http.patch("/api/bikes/" + $scope.bikeId + "/reserve").then(function(response) {
            bikeReservationInner(response);
            console.log("here")
            $scope.myBikes.push($scope.bikeId);
        }, bikeReservationInner);
    }
    $scope.clearBike = function() {
        $http.patch("/api/bikes/" + $scope.bikeId + "/clear").then(function(response) {
            bikeReservationInner(response);
            var index = $scope.myBikes.indexOf($scope.bikeId);
            if (index > -1) {
                $scope.myBikes.splice(index, 1);
            }
        }, bikeReservationInner);
    }
    
    var styles = [];
    var colors = ["green", "blue", "orange", "purple", "gray"];
    var colorIndex = 0;
    
    $scope.getStyle = function(message) {
        if (!styles[message]) {
            styles[message] = {'color': colors[colorIndex]};
            colorIndex = colorIndex < colors.length - 1 ? colorIndex + 1 : 0;
        }
        return styles[message];
    }

});
