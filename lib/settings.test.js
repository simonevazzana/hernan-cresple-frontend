const test = require('ava')
const { getSettings } = require('./settings')

test('Should return the settings for the test environment', t => {
  const settings = getSettings()

  t.deepEqual(settings, {
    backendUrl: 'localhost:2111'
  })
})

test('Should return the settings for the development environment as default', t => {
  delete process.env.ENV
  delete process.env.NODE_ENV

  const settings = getSettings()

  t.deepEqual(settings, {
    backendUrl: 'localhost:2111'
  })

  process.env.ENV = 'test'
  process.env.NODE_ENV = 'test'
})
