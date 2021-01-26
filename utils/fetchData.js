const axios = require('axios')

// api url
const DOMAIN = process.env.DOMAIN || 'http://localhost:3000'
const BASE_URL = DOMAIN + '/api/v1'

const fetchData = async (req, option) => {
  const token = req.cookies.token ? req.cookies.token : ''
  const config = {
    headers: { ...option.config, authorization: `Bearer ${token}` }
  }
  let res
  const url = BASE_URL + option.path
  const data = option.data ? option.data : {}
  switch (option.method) {
    case 'get':
      res = await axios.get(url, config)
      break
    case 'post':
      res = await axios.post(url, data, config)
      break
    case 'put':
      res = await axios.put(url, data, config)
      break
    case 'delete':
      res = await axios.delete(url, { ...data, ...config })
      break
    default:
      break
  }
  return res.data
}

module.exports = fetchData
