const currencyFormat = ({
  value, currency = 'USD', locales = 'en-US'
}) => {
  const formatter = new Intl.NumberFormat(locales, {
    style: 'currency',
    currency,
  })

  return formatter.format(value)
}

export default currencyFormat
