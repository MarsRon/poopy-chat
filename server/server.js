// Modules
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')

const PORT = 3000
const app = express()
const server = http.createServer(app)
const io = new Server(server)

// Static files
app.use(express.static(path.join(__dirname, '../client')))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

io.on('connection', socket => {
  // User joins with username
  socket.on('username', async username => {
    socket.username = username
    io.sockets.emit('userAdd', {
      user: socket.username,
      userCount: (await io.sockets.allSockets()).size
    })
  })

  // New message sent
  socket.on('messageCreate', message => {
    socket.broadcast.emit('messageCreate', {
      user: socket.username,
      message
    })
  })

  // User leaves
  socket.on('disconnect', async () => {
    socket.broadcast.emit('userRemove', {
      user: socket.username,
      userCount: (await io.sockets.allSockets()).size
    })
  })
})

// Socket.io listens to port
server.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`)
})
