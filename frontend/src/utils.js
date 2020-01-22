import colors from 'vuetify/lib/util/colors'

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

const idx = (object, keyPath) => {
  // record.category.user.name
  // result: ['record', 'category', 'user', 'name']
  const keys = keyPath.split('.')
  return keys.reduce(
    (obj, current) => (obj && obj[current] ? obj[current] : null),
    object
  )
}

const generateChartData = ({
  items,
  keyToGroup,
  keyOfValue,
  aliases,
  type,
  backgroundColors
}) => {
  const grouped = groupBy(items, keyToGroup, idx) || []
  const response = {}

  for (let key in grouped) {
    response[(aliases && aliases[key]) || key] = grouped[key].reduce(
      (acc, item) => Number(acc) + Number(item[keyOfValue]),
      0
    )
  }

  const labels = Object.keys(response) || []

  switch (type) {
    case 'bar':
      return {
        datasets: labels.map((label, index) => ({
          label: `${label}: ${currencyFormatter().format(response[label])}`,
          data: [response[label] >= 0 ? response[label] : -response[label]],
          backgroundColor: backgroundColors[index],
          borderWidth: 0
        }))
      }

    case 'doughnut':
      return {
        datasets: [
          {
            data: labels.map(label =>
              response[label] >= 0 ? response[label] : -response[label]
            ),
            backgroundColor: backgroundColors || generateColors(labels.length),
            borderWidth: 0
          }
        ],
        labels: items && items.length > 0 ? labels : []
      }
  }
}

const generateChartConfig = opts => {
  const { type } = opts
  const data = generateChartData(opts)
  const options = generateChartOptions(type)

  return { type, data, options }
}

const generateChartOptions = type => {
  let tooltips = {}

  switch (type) {
    case 'bar':
      tooltips = {
        callbacks: {
          title() {},
          label(tooltip, data) {
            return data.datasets[tooltip.datasetIndex].label
          }
        }
      }
      break

    case 'doughnut':
      tooltips = {
        callbacks: {
          label(tooltip, data) {
            const label = data.labels[tooltip.index]
            const value = currencyFormatter().format(
              data.datasets[tooltip.datasetIndex].data[tooltip.index]
            )

            return `${label}: ${value}`
          }
        }
      }
      break

    default:
      break
  }

  const scales = {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ]
  }

  return { scales, tooltips }
}

const generateColors = length => {
  if (!length) {
    return []
  }

  const pallets = Object.keys(colors).filter(pallet => pallet !== 'shades')

  const tones = ['base']
  for (let i = 1; i <= 5; i++) {
    tones.push(`darken${i}`)
    tones.push(`lighten${i}`)
  }

  let currentPallet = 0
  let currentTone = 0

  return Array(Math.abs(length))
    .fill()
    .map((item, index) => {
      const color = colors[pallets[currentPallet]][tones[currentTone]]
      currentPallet++
      if ((index + 1) % pallets.length === 0) {
        currentPallet = 0
        currentTone++
      }
      return color || '#0191f1' // Defaults to blue in case of undefined.
    })
}

const registerVuexModule = (rootStore, moduleName, store) => {
  if (!(moduleName in rootStore._modules.root._children)) {
    rootStore.registerModule(moduleName, store)
  }
}

export {
  currencyFormatter,
  errorHandler,
  formatError,
  generateChartConfig,
  groupBy,
  registerVuexModule
}
