const config = {
  port: process.env.PORT || 5000,
  remoteWsServer: 'wss://stream.binance.com:9443/ws/',
  firebaseConfig: {
    apiKey: process.env.DB_API_KEY,
    authDomain: process.env.DB_AUTH_DOMAIN,
    databaseURL: process.env.DB_URL,
    projectId: process.env.DB_PROJECT_ID,
    storageBucket: process.env.DB_STORAGE_BUCKET,
    messagingSenderId: process.env.DB_MESSAGING_SENDER_ID,
    appId: process.env.DB_APP_ID
  }
}

module.exports = config