import React, {
  useState, useEffect, useContext, useMemo
} from 'react'
import PropTypes from 'prop-types'

// Context
import { SocketContext } from '@/context/socket'

// Utils
import currencyFormat from '@/utils/currencyFormat'

// Components
import Button from '@/components/atoms/Button'
import Ticker from '@/components/atoms/Ticker'

// Styling
import styles from './game.module.scss'

const updateUsers = (users, bets) => {
  // Need to update user list here and full list including bets
  // Combine arrays
  const updatedUsers = users.filter(({ userID }) => bets.some((bet) => userID === bet.userID))
  return updatedUsers
}

const Game = ({
  tickerPrice,
  rounds,
  timeLeft,
  users,
  bets
}) => {
  const socket = useContext(SocketContext)

  const [roundId, setRoundId] = useState()
  const [roundPrice, setRoundPrice] = useState()
  const [roundDate, setRoundDate] = useState()

  const [isBetActive, setIsBetActive] = useState(false)

  const updatedUsers = useMemo(() => updateUsers(users, bets), [users, bets])

  useEffect(() => {
    console.log(users)
    console.log(bets)
    console.log(updatedUsers)
  }, [bets])

  useEffect(() => {
    const {
      id, price, date
    } = rounds[0] || {}

    setRoundId(id)
    setRoundPrice(price)
    setRoundDate(date)
  }, [rounds])

  const handleClick = (guess) => {
    // Disable buttons when user has bet
    setIsBetActive(true)

    // Send guess to server (higher or lower)
    socket.emit('guess', {
      userID: socket.userID,
      guess
    })
  }

  return (
    <div className={styles.game}>
      <div className={styles.left}>
        <div className={styles.header}>
          <p>Higher Lower Game</p>
        </div>
        <div className={styles.main}>
          <p>Time left: {timeLeft}</p>
          <div className={styles.prices}>
            <div className={styles.price}>
              <p>Round {roundId} started at</p>
              {rounds.length && (
                <Ticker price={currencyFormat({ value: roundPrice })} />
              )}
            </div>
            <div className={styles.price}>
              <p>Current price</p>
              <Ticker price={currencyFormat({ value: tickerPrice })} />
            </div>
          </div>
        </div>
        <div className={styles.rounds}>
          <p>Previous rounds</p>
          <ul className={styles['rounds-list']}>
            {rounds.length
              && rounds.map(({ id, price }) => (
                <li key={id} className={styles['rounds-list-item']}>
                  {currencyFormat({ value: price })}
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.header} />
        <div className={styles.main}>
          <ul className={styles.userlist}>
            <li>Online users:</li>
            {/* User updatedUsers instead */}
            {users && users.map(({
              userID,
              bet
            }, idx) => {
              // console.log(users)
              let a
              return (
                <li key={idx}>
                  <span>{userID.split('-')[0]}</span>
                  {bet && (<span>{bet}</span>)}
                </li>
              )
            })}
          </ul>
          <div className={styles['game-actions']}>
            <Button
              variation="negative"
              className={styles.button}
              onClick={() => handleClick('lower')}
              // isDisabled={isBetActive}
            >
              Lower
            </Button>
            <Button
              variation="positive"
              className={styles.button}
              onClick={() => handleClick('higher')}
              // isDisabled={isBetActive}
            >
              Higher
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

Game.propTypes = {
  tickerPrice: PropTypes.string,
  rounds: PropTypes.array,
  timeLeft: PropTypes.number,
  users: PropTypes.array,
  bets: PropTypes.array,
}

export default Game
