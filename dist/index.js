'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _websocket = require('websocket');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = _http2.default.createServer(function (req, res) {
	console.log('Wow a HTTP request!');
	res.send('Wow a HTTP request!');
});

var PORT = process.env.PORT || 8000;
server.listen(PORT, function () {
	return console.log('Server is listening on port ' + PORT);
});

var wsServer = new _websocket.server({
	httpServer: server
});

wsServer.on('request', function (r) {
	var connection = r.accept(null, r.origin);

	console.log('Connection Accepted');

	connection.on('message');
});