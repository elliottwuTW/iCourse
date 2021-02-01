/**
 * get the trade info needed for spgateway
 */
const crypto = require('crypto')

// Create url-encoded string
const urlEncodedString = (data) => {
  const keyValueArr = []
  Object.keys(data).forEach(key => {
    keyValueArr.push(`${key}=${data[key]}`)
  })
  return keyValueArr.join('&')
}

// Encrypt data with AES 256 algorithm
const encryptAES256 = (data, HashKey, HashIV) => {
  const encipher = crypto.createCipheriv('aes256', HashKey, HashIV)
  const encrypted = encipher.update(urlEncodedString(data), 'utf8', 'hex')

  return encrypted + encipher.final('hex')
}

// function create_mpg_aes_decrypt (TradeInfo, HashKey, HashIV) {
//   const decrypt = crypto.createDecipheriv('aes256', HashKey, HashIV)
//   decrypt.setAutoPadding(false)
//   const text = decrypt.update(TradeInfo, 'hex', 'utf8')
//   const plainText = text + decrypt.final('utf8')
//   const result = plainText.replace(/[\x00-\x20]+/g, '')
//   return result
// }

// Hash data with SHA 256 algorithm
const hashSHA256 = (data, HashKey, HashIV) => {
  // spgateway required plain text
  const plainText = `HashKey=${HashKey}&${data}&HashIV=${HashIV}`

  return crypto.createHash('sha256').update(plainText).digest('hex').toUpperCase()
}

// Return trade info needed in spgateway
const getTradeInfo = (amount, orderDesc, email) => {
  // env variables
  const API_SERVER_URL = process.env.DOMAIN
  const SERVER_URL = process.env.SERVER_URL || ''
  const PayURL = process.env.PAY_URL
  const MerchantID = process.env.MERCHANT_ID
  const Version = process.env.SPGATEWAY_VERSION

  const HashKey = process.env.HASH_KEY
  const HashIV = process.env.HASH_IV

  // plain parameters in TradeInfo
  const data = {
    MerchantID,
    RespondType: 'JSON',
    TimeStamp: Date.now(),
    Version,
    LoginType: 0,
    MerchantOrderNo: Date.now(),
    Amt: amount,
    ItemDesc: orderDesc,
    OrderComment: 'Wish you a good learning',
    Email: email,
    NotifyURL: 'https://edb1d2d03c5e.ngrok.io/api/v1/orders/spgateway/callback/notify',
    ReturnURL: 'https://ac13d625d0c0.ngrok.io/orders/spgateway/callback/return',
    ClientBackURL: 'https://ac13d625d0c0.ngrok.io/orders'
    // NotifyURL: API_SERVER_URL + '/spgateway/callback/notify',
    // ReturnURL: SERVER_URL + '/spgateway/callback/return',
    // ClientBackURL: SERVER_URL + '/orders'
  }

  const encryptedTradeInfo = encryptAES256(data, HashKey, HashIV)

  // MerchantID, TradeInfo, TradeSha, Version
  return ({
    MerchantID, // 商店代號
    TradeInfo: encryptedTradeInfo, // 加密後參數
    TradeSha: hashSHA256(encryptedTradeInfo, HashKey, HashIV),
    Version, // 串接程式版本
    PayURL
  })
}

module.exports = getTradeInfo
