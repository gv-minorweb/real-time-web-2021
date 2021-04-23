import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

function useSocket(url, options) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socket = io(url, { ...options, autoConnect: false })
    setSocket(socket)
    return () => socket.disconnect()
  }, [])

  return socket
}

export default useSocket
