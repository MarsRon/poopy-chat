const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const path = require('path')
const PORT = 3000

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname, '../client')))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

io.on('connection', socket => {
  socket.on('username', username => {
    socket.username = username
    io.sockets.allSockets().then(allSockets => {
      socket.emit('userAdd', {
        user: socket.username,
        userCount: allSockets.size
      })
      socket.broadcast.emit('userAdd', {
        user: socket.username,
        userCount: allSockets.size
      })
    })
  })

  socket.on('messageCreate', message => {
    socket.broadcast.emit('messageCreate', { user: socket.username, message })
  })

  socket.on('disconnect', async () => {
    socket.broadcast.emit('userRemove', {
      user: socket.username,
      userCount: (await io.sockets.allSockets()).size
    })
  })
})

server.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`)
})
