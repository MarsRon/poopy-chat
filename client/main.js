const signupForm = document.getElementById('signup-form')

let username = 'Guest'

signupForm.addEventListener('submit', e => {
  e.preventDefault()

  // Set username
  username = document.getElementById('username').value.slice(0, 20) ?? 'Guest'

  // Remove signup while making chat visible
  signupForm.parentElement.remove()
  document.getElementById('chat').style = ''

  // Create socket
  const socket = io()
  socket.emit('username', username)
  setup(socket)
})

function setup (socket) {
  const chatbox = document.getElementById('chatbox')
  const chatboxInput = document.getElementById('chatbox-input')
  const userCount = document.getElementById('user-count')
  const messages = document.getElementById('messages')

  // When user sends new message
  chatbox.addEventListener('submit', e => {
    e.preventDefault()
    if (chatboxInput.value) {
      socket.emit('messageCreate', chatboxInput.value.trim())
      messageCreate({
        user: username,
        message: chatboxInput.value.trim()
      })
      chatboxInput.value = ''
    }
  })

  // Displays new message
  function messageCreate ({ user, message }) {
    const item = document.createElement('li')
    // Adds "user: " if there's a user
    item.innerHTML = user
      ? `<strong>${user}</strong>: ${message}`
      : message
    messages.appendChild(item)
    // Scroll to bottom
    window.scrollTo(0, document.body.scrollHeight)
  }

  // User added, update users online count
  function userAdd ({ user, userCount: count }) {
    messageCreate({
      message: `${user} joined the chat`
    })
    userCount.textContent = `Users online: ${count}`
  }

  // User left, update users online count
  function userRemove ({ user, userCount: count }) {
    messageCreate({
      message: `${user} left the chat`
    })
    userCount.textContent = `Users online: ${count}`
  }

  socket.on('messageCreate', messageCreate)
  socket.on('userAdd', userAdd)
  socket.on('userRemove', userRemove)
}
