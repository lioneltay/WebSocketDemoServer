'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _websocket = require('websocket');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use('*', function (req, res) {
	console.log('Wow a http request.');
	res.send('Wow a http request.');
});

var server = _http2.default.createServer(app);

var PORT = process.env.PORT || 8000;
server.listen(PORT, function () {
	return console.log('Server is listening on port ' + PORT);
});

var wsServer = new _websocket.server({
	httpServer: server
});

var history = [];
var clients = [];

wsServer.on('request', function (r) {
	var connection = r.accept(null, r.origin);

	var clientIndex = clients.push(connection) - 1;
	var name = void 0,
	    color = void 0;

	console.log('Connection Accepted');

	// Send existing messages to the newly connected user
	connection.sendUTF(JSON.stringify({ type: 'history', data: history }));

	// Create an event listener
	connection.on('message', function (message) {
		if (message.type !== 'utf8') return;

		// First message will always be the users name
		if (!name) {
			name = message.utf8Data;
			color = randomColorString();

			var data = { type: 'color', data: color };
			connection.send(JSON.stringify(data));

			console.log('[' + new Date() + '] New User: ' + name + ', Color: ' + color);
		}

		// Other messages will be a chat message
		else {
				(function () {
					console.log('Received message from ' + name + ': ' + message.utf8Data);

					var chatMessage = {
						timestamp: Date.now(),
						text: message.utf8Data,
						author: name,
						color: color
					};

					// Add the message to the chat history
					history.push(chatMessage);
					// Remove old message if there are more than 100
					history = history.slice(-100);

					// Send new message to all clients
					var data = { type: 'message', data: chatMessage };
					clients.forEach(function (client) {
						return client.sendUTF(JSON.stringify(data));
					});
				})();
			}
	});

	connection.on('close', function (connection) {
		// If there is a user with a name
		if (name !== false) {
			console.log('[' + new Date() + ']: Peer ' + connection.remoteAddress + ' disconnected.');
			// Remove use from client list
			clients.splice(clientIndex, 1);
		}

		// User exited before choosing a name
		else {
				console.log('SOMEONE EXITED BEFORE INITIALISNG');
			}
	});
});

// Helper functions

// Returns a random int in [a, b]
function randomInt(a, b) {
	return Math.floor(Math.random() * (b + 1) + a);
}

function randomColorString() {
	return 'rgb(' + randomInt(0, 255) + ', ' + randomInt(0, 255) + ', ' + randomInt(0, 255) + ')';
}