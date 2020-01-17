const currencyFormatter = (
  { locale, currency } = { locale: 'pt-BR', currency: 'BRL' }
) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  })

const errorHandler = (err, vm, info) => {
  console.log('Vue [error handler]: ', err, info)
  const jwtErrors = [
    'jwt malformed',
    'jwt expired',
    'jwt not active',
    'invalid token'
  ]

  if (jwtErrors.some(jwtError => err.message.includes(jwtError))) {
    vm.$router.push({
      path: '/sign',
      query: { redirect: vm.$route.path }
    })
  }
}

const formatError = message => {
  const messageSplit = message.split(':')
  return messageSplit[messageSplit.length - 1].trim()
}

const groupBy = (array, key, makeCurrentKey) => {
  if (array) {
    return array.reduce((accumulated, item) => {
      const currentKey = makeCurrentKey(item, key)

      return {
        ...accumulated,
        [currentKey]: [...(accumulated[currentKey] || []), item]
      }
    }, {})
  }

  return []
}

export { currencyFormatter, errorHandler, formatError, groupBy }
