import React, {
  useState, useEffect, useContext
} from 'react'

// Context
import { SocketContext } from '@/context/socket'

// Components
import Game from '@/components/organisms/Game'

const Homepage = () => {
  const socket = useContext(SocketContext)

  const [tickerPrice, setTickerPrice] = useState('')
  const [users, setUsers] = useState([])
  const [rounds, setRounds] = useState([])
  const [bets, setBets] = useState([])
  const [roundTime, setRoundTime] = useState(30)

  useEffect(() => {
    // On page load, get session ID from localStorage
    const sessionID = localStorage.getItem('sessionID')

    if (sessionID) {
      socket.auth = { sessionID }
    }

    socket.connect()

    socket.on('session', ({ sessionID, userID }) => {
      // Attach session ID to the next reconnection attempts
      socket.auth = { sessionID }
      // Store it in localStorage
      localStorage.setItem('sessionID', sessionID)
      // Save the ID of the user
      socket.userID = userID
    })

    socket.on('users', (res) => {
      setUsers(res)
    })

    // Request initial round data
    socket.emit('get-round')

    socket.on('round', (res) => {
      setRounds((rounds) => [res, ...rounds.slice(0, 4)])
    })

    socket.on('user connected', (res) => {
      const { userID } = res

      setUsers((users) => {
        console.log(res)
        console.log(users)

        if (users.some((user) => user.userID === userID)) {
          return [...users]
        }
        return [...users, res]
      })
    })

    socket.on('user disconnected', (res) => {
      setUsers((users) => users.filter((user) => user !== res))
    })

    socket.on('price-update', (res) => {
      const {
        E: eventTime,
        c: closePrice,
      } = JSON.parse(res)

      const formattedPrice = (Math.round((parseFloat(closePrice) + Number.EPSILON) * 100) / 100).toFixed(2)
      setTickerPrice(formattedPrice)
    })

    socket.on('bets', (res) => {
      setBets(res)
    })

    return () => socket.disconnect()
  }, [socket])

  return (
    <main>
      <div className="container-lg">
        <Game
          tickerPrice={tickerPrice}
          rounds={rounds}
          timeLeft={roundTime}
          users={users}
          bets={bets}
        />
      </div>
    </main>
  )
}

export default Homepage
