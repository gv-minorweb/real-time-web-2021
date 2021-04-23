import React from 'react'
import PropTypes from 'prop-types'

// Utils
import currencyFormat from '@/utils/currencyFormat'

// Styling
import styles from './ticker.module.scss'

const Ticker = ({
  price
}) => (
  <div className={styles.ticker}>
    {price}
  </div>
)

Ticker.propTypes = {
  price: PropTypes.string,
}

export default Ticker
