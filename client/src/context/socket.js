import React from 'react'
import PropTypes from 'prop-types'
import { io } from 'socket.io-client'

const SocketContext = React.createContext()

const SocketProvider = ({ children }) => {
  const ENDPOINT = 'wss://localhost:5000'
  const socket = io(ENDPOINT, { autoConnect: false })
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

SocketProvider.propTypes = {
  children: PropTypes.any,
}

export { SocketContext, SocketProvider }
