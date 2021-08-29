const usernameForm = document.getElementById('username-form')
const chat = document.getElementById('chat')

let username = 'Guest'

usernameForm.addEventListener('submit', e => {
  e.preventDefault()
  const value = document.getElementById('username').value.slice(0, 20)
  if (value) {
    username = value
  }
  usernameForm.parentElement.remove()
  chat.style = ''
  const socket = io()
  socket.emit('username', username)
  setup(socket)
})

function setup (socket) {
  const form = document.getElementById('form')
  const input = document.getElementById('input')
  const userCount = document.getElementById('user-count')
  const messages = document.getElementById('messages')

  form.addEventListener('submit', e => {
    e.preventDefault()
    if (input.value) {
      socket.emit('messageCreate', input.value)
      messageCreate({
        user: username,
        message: input.value
      })
      input.value = ''
    }
  })

  const bold = s => `<strong>${s}</strong>`

  function messageCreate ({ user, message }) {
    const item = document.createElement('li')
    item.innerHTML = user
      ? `<strong>${user}</strong>: ${message}`
      : `${message}`
    messages.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight)
  }

  function userAdd ({ user, userCount: count }) {
    messageCreate({
      message: `${user} joined the chat`
    })
    userCount.textContent = `Users online: ${count}`
  }

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
