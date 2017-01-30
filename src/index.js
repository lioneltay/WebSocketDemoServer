import http from 'http'
import express from 'express'
import { server as WebSocketServer } from 'websocket'

const app = express()

app.use('*', (req, res) => {
	console.log('Wow a http request.')
	res.send('Wow a http request.')
})

const server = http.createServer(app)

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