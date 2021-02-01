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

// Decrypt data
const decryptAES256 = (data, HashKey, HashIV) => {
  const decrypt = crypto.createDecipheriv('aes256', HashKey, HashIV)
  decrypt.setAutoPadding(false)
  const text = decrypt.update(data, 'hex', 'utf8')
  return (text + decrypt.final('utf8')).replace(/[\x00-\x20]+/g, '')
}

// Hash data with SHA 256 algorithm
const hashSHA256 = (data, HashKey, HashIV) => {
  // spgateway required plain text
  const plainText = `HashKey=${HashKey}&${data}&HashIV=${HashIV}`

  return crypto.createHash('sha256').update(plainText).digest('hex').toUpperCase()
}

// Return trade info needed in spgateway
const getTradeInfo = (amount, orderDesc, email) => {
  // env variables
  const URL = process.env.URL
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
    NotifyURL: URL + '/orders/spgateway/callback?from=Notify',
    ReturnURL: URL + '/orders/spgateway/callback?from=Return',
    ClientBackURL: URL + '/orders'
  }

  const encryptedTradeInfo = encryptAES256(data, HashKey, HashIV)

  // MerchantID, TradeInfo, TradeSha, Version
  return ({
    MerchantID, // 商店代號
    TradeInfo: encryptedTradeInfo, // 加密後參數
    TradeSha: hashSHA256(encryptedTradeInfo, HashKey, HashIV),
    Version, // 串接程式版本
    PayURL,
    sn: data.MerchantOrderNo
  })
}

module.exports = { getTradeInfo, decryptAES256 }
