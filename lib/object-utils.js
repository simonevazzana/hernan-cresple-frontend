export const filterObjectProperties = (obj) => Object.entries(obj)
  .filter(([key, value]) => value)
  .reduce((acc, curr) => {
    acc[curr[0]] = curr[1]
    return acc
  }, {})
