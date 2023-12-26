const test = require('ava')
const { getBackendUrl } = require('./get-backend-url')

test('Should return the proper url with the path based on the ENV property', t => {
  const url = getBackendUrl('v1/dribble-start')

  t.is(url, 'localhost:2111/v1/dribble-start')
})
