const axios = require('axios')

const fetchData = async (method, apiURL, config = {}) => {
  let res
  switch (method) {
    case 'get':
      res = await axios.get(apiURL, config)
      break
    case 'post':
      res = await axios.post(apiURL, config)
      break
    case 'put':
      res = await axios.put(apiURL, config)
      break
    case 'delete':
      res = await axios.delete(apiURL, config)
      break
    default:
      break
  }
  return res.data
}

module.exports = fetchData
