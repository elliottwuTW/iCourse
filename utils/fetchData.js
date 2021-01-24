const axios = require('axios')

// api url
const DOMAIN = process.env.DOMAIN || 'http://localhost:3000'
const BASE_URL = DOMAIN + '/api/v1'

const fetchData = async (method, path, config = {}) => {
  let res
  switch (method) {
    case 'get':
      res = await axios.get(BASE_URL + path, config)
      break
    case 'post':
      res = await axios.post(BASE_URL + path, config)
      break
    case 'put':
      res = await axios.put(BASE_URL + path, config)
      break
    case 'delete':
      res = await axios.delete(BASE_URL + path, config)
      break
    default:
      break
  }
  return res.data
}

module.exports = fetchData
