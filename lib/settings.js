const settings = {
  test: {
    backendUrl: 'http://localhost:2111'
  },
  development: {
    backendUrl: 'http://localhost:2111'
  },
  staging: {
    backendUrl: 'TBD'
  },
  production: {
    backendUrl: 'TBD'
  }
}

export const getSettings = () => {
  const env = import.meta.env.ENV || import.meta.env.NODE_ENV

  if (settings[env]) return settings[env]

  return settings.development
}
