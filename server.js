var os = require('os');
var morgan = require('morgan');
var express = require('express');
var request = require('request');

var bikesServiceUri = process.env.BIKES_SERVICE_URI;
if (!bikesServiceUri) {
    console.error("Bikes service URI not defined!");
    process.exit(1);
}
console.log("Bikes URI: " + bikesServiceUri)

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(morgan("dev"));

// application -------------------------------------------------------------
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/availableBikes', function (req, res) {
    request.get(bikesServiceUri + "/api/availableBikes", function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.send(body);
    });
});

app.patch('/api/bikes/:bikeId/reserve', function(req, res) {
    if (!req.params.bikeId) {
        res.status(400).send('Must specify bikeId');
        return;
    }

    handleReservation(res, req.params.bikeId, "/reserve");
});

app.patch('/api/bikes/:bikeId/clear', function(req, res) {
    if (!req.params.bikeId) {
        res.status(400).send('Must specify bikeId');
        return;
    }

    handleReservation(res, req.params.bikeId, "/clear");
});

function handleReservation(res, bikeId, endpoint) {
    request.patch(bikesServiceUri + "/api/bikes/" + bikeId + endpoint, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
}

var port = 80;
var server = app.listen(port, function () {
    console.log('Listening on port ' + port);
});

process.on("SIGINT", () => {
    process.exit(130 /* 128 + SIGINT */);
});

process.on("SIGTERM", () => {
    console.log("Terminating...");
    server.close();
});
