// parse and generate form data
module.exports = (req) => {
  const FormData = require('form-data')
  const fs = require('fs')

  // parse and generate another form
  const formData = new FormData()
  // fields
  Object.entries(req.body).forEach(entry => {
    formData.append(entry[0], entry[1])
  })
  // photo
  if (req.file) {
    formData.append('photo', fs.createReadStream(`./${req.file.path}`))
  }

  return formData
}
