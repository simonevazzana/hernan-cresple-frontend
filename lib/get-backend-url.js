const { getSettings } = require('./settings')

const settings = getSettings()

const getBackendUrl = (path) => `${settings.backendUrl}/${path}`

module.exports = {
  getBackendUrl
}
