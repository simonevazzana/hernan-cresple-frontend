const settings = {
  test: {
    backendUrl: 'localhost:2111'
  },
  development: {
    backendUrl: 'localhost:2111'
  },
  staging: {
    backendUrl: 'TBD'
  },
  production: {
    backendUrl: 'TBD'
  }
}

const getSettings = () => {
  const env = process.env.ENV || process.env.NODE_ENV

  if (settings[env]) return settings[env]

  return settings.development
}

module.exports = {
  getSettings
}
