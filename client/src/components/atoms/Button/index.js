import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

// Styles
import styles from './button.module.scss'

const Button = ({
  variation = 'primary',
  onClick,
  size = 'md',
  children,
  label = '',
  href = '',
  isDisabled = false,
  className = '',
  contentClassName = '',
  ...props
}) => {
  // Shared classNames (less duplicate code)
  const sharedClassNames = `${styles[size]} ${styles[variation]} ${isDisabled ? styles.disabled : ''}`

  return (
    <button
      className={`
        ${styles.button}
        ${sharedClassNames}
        ${className}
      `}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-label={label}
      tabIndex={0}
      {...props}
    >
      <div
        className={`${styles['button-content']} ${sharedClassNames}
        ${contentClassName}`}
        tabIndex={-1}
      >
        {children}
      </div>
    </button>
  )
}

Button.propTypes = {
  variation: PropTypes.oneOf([
    'primary',
    'positive',
    'negative'
  ]),
  onClick: PropTypes.func,
  size: PropTypes.oneOf([
    'sm',
    'md',
    'lg'
  ]),
  children: PropTypes.any.isRequired,
  label: PropTypes.string,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  contentClassName: PropTypes.string
}

export default Button
