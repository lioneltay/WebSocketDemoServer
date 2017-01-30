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

wsServer.on('request', function (r) {
	var connection = r.accept(null, r.origin);

	console.log('Connection Accepted');

	connection.on('message');
});