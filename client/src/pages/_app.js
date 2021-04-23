import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

import { SocketProvider } from '@/context/socket'

// Styling
import '../styles/master.scss'

const metaData = {
  name: 'Higher Lower Game',
  description: 'Predict the price of Bitcoin in the next 30 seconds'
}

function App({ Component, pageProps }) {
  const { name, description } = metaData

  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name="description" content={description} />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <SocketProvider>
        <Component {...pageProps} />
      </SocketProvider>
    </>
  )
}

App.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any
}

export default App
