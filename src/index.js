import http from 'http'
import express from 'express'
import { server as WebSocketServer } from 'websocket'


// Keep server alive, chat history is stored in memory
setInterval(function() {
	http.get("http://stream-chat-demo.herokuapp.com");
}, 300000);

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


let history = []
const clients = []

wsServer.on('request', function(r) {
	const connection = r.accept(null, r.origin)
	
	const clientIndex = clients.push(connection) - 1
	let name, color
	
	console.log('Connection Accepted')
	
	// Send existing messages to the newly connected user
	connection.sendUTF(JSON.stringify({ type: 'history', data: history }))
	
	// Create an event listener
	connection.on('message', (message) => {
		if (message.type !== 'utf8') return
		
		// First message will always be the users name
		if (!name) {
			name = message.utf8Data
			color = randomColorString()
			
			const data = { type: 'color', data: color }
			connection.send(JSON.stringify(data))
			
			console.log(`[${new Date()}] New User: ${name}, Color: ${color}`)
		}
		
		// Other messages will be a chat message
		else {
			console.log(`Received message from ${name}: ${message.utf8Data}`)
			
			const chatMessage = {
				timestamp: Date.now(),
				text: message.utf8Data,
				author: name,
				color,
			}
			
			// Add the message to the chat history
			history.push(chatMessage)
			// Remove old message if there are more than 100
			history = history.slice(-100)
			
			// Send new message to all clients
			const data = { type: 'message', data: chatMessage }
			clients.forEach(client => client.sendUTF(JSON.stringify(data)))	
		}
	})
	
	connection.on('close', function(connection) {
		// If there is a user with a name
		if (name !== false ) {
			console.log(`[${new Date()}]: Peer ${connection.remoteAddress} disconnected.`)
			// Remove use from client list
			clients.splice(clientIndex, 1)
		} 
		
		// User exited before choosing a name
		else {
			console.log('SOMEONE EXITED BEFORE INITIALISNG')
		}
	})
})






// Helper functions

// Returns a random int in [a, b]
function randomInt(a,b) {
	return Math.floor(Math.random() * (b + 1) + a)
}

function randomColorString() {
	return `rgb(${randomInt(0,255)}, ${randomInt(0,255)}, ${randomInt(0,255)})`
}






