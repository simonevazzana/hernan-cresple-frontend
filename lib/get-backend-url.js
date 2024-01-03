import { getSettings } from './settings'

const settings = getSettings()

export const getBackendUrl = (path) => `${settings.backendUrl}/${path}`
