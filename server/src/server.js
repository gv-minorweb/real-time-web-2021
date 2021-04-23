require('dotenv').config()

// Packages
const fs = require('fs')
const https = require('https')
const WebSocket = require('ws')
const socket = require('socket.io')
// const firebase = require('firebase')
const { v4: uuidv4 } = require('uuid')
// const toDate = require('date-fns/toDate')

const { port, remoteWsServer, firebaseConfig } = require('./config')

const server = https.createServer({
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
})

// Initialize socket.io server for client connection
const io = socket(server, { cors: { origin: 'http://localhost:3000' } })

// Database
// firebase.initializeApp(firebaseConfig)
// var db = firebase.database()

const { InMemorySessionStore } = require('./utils/sessionStore')
const sessionStore = new InMemorySessionStore()

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID

  if (sessionID) {
    // Find existing session
    const session = sessionStore.findSession(sessionID)

    if (session) {
      socket.sessionID = sessionID
      socket.userID = session.userID
      return next()
    }
  }

  socket.sessionID = uuidv4()
  socket.userID = uuidv4()

  next()
})

const rounds = []
const bets = {
  currentRound: [],
  nextRound: []
}

io.on('connection', (socket) => {
  console.log('Client connected', socket.sessionID)
  // persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    connected: true,
  })

  // emit session details
  socket.emit('session', {
    sessionID: socket.sessionID,
    userID: socket.userID,
  })

  // join the "userID" room
  socket.join(socket.userID)

  // fetch existing users
  const users = []
  /*{
    userID: String,
    connected: Bool,
    bets: Number,
    wins: Number,
    losses: Number
  }*/

  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      connected: session.connected,
      bet: null
    })
  })

  // Emit all connected users
  socket.emit('users',
    // users.filter(({ connected }) => connected).map(({ userID }) => userID)
    users.filter(({ connected }) => connected)
  )

  // notify existing users
  socket.broadcast.emit('user connected', {
    userID: socket.userID,
    connected: true,
    bet: null
  })

  // notify users upon disconnection
  socket.on('disconnect', async () => {
    const matchingSockets = await io.in(socket.userID).allSockets()
    const isDisconnected = matchingSockets.size === 0
    if (isDisconnected) {
      // Notify all connected clients except the sender
      socket.broadcast.emit('user disconnected', socket.userID)
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        connected: false,
      })
    }
  })

  socket.on('get-round', () => {
    socket.emit('round', rounds[0])
  })

  // User has made a prediction
  socket.on('guess', ({ userID, guess }) => {
    const { nextRound } = bets

    // Get user bet
    const bet = {
      userID,
      guess
    }

    // Push to nextRound array
    nextRound.push(bet)
  })
})

// const wssRemote = new WebSocket(process.env.WEBSOCKET_URL)
const remoteStream = 'btcusdt@miniTicker'
const wssRemote = new WebSocket(`${remoteWsServer}${remoteStream}`)

wssRemote.on('message', (res) => {
  const {
    E: eventTime,
    c: closePrice,
  } = JSON.parse(res)

  const formattedPrice = (Math.round((parseFloat(closePrice) + Number.EPSILON) * 100) / 100).toFixed(2)

  const currentTime = Date.now()

  // Create initial round
  if (!rounds.length) {
    rounds.unshift({
      id: rounds.length + 1,
      price: formattedPrice,
      date: eventTime
    })

    // Send rounds data to clients
    io.emit('round', rounds[0])
  }
  
  const { date: currentRoundEventTime } = rounds[0]
  const difference = Math.floor((currentTime - currentRoundEventTime) / 1000)

  // New round start
  if (difference >= 10) {
    rounds.unshift({
      id: rounds.length + 1,
      price: formattedPrice,
      date: eventTime
    })

    // Send latest round data to clients
    io.emit('round', rounds[0])

    bets.currentRound.length = 0

    // Move nextRound bets to currentRound bets
    bets.currentRound = [...bets.nextRound]

    // Clear bets
    bets.nextRound.length = 0

    // Send bets for current round to all connected clients
    io.emit('bets', bets.currentRound)
  }

  // Send price update to all clients
  io.emit('price-update', res)
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
