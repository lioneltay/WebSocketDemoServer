import http from 'http'
import { server as WebSocketServer } from 'websocket'

const server = http.createServer((req, res) => {
	console.log('Wow a HTTP request!')
	res.send('Wow a HTTP request!')
})

const PORT = process.env.PORT || 8000
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))

const wsServer = new WebSocketServer({
	httpServer: server,
})

wsServer.on('request', function(r) {
	const connection = r.accept(null, r.origin)
	
	console.log('Connection Accepted')
	
	connection.on('message')
})