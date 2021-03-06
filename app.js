const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const methodOverride = require('method-override')

const routes = require('./routes/index')
const errorHandler = require('./middleware/error')

dotenv.config()

const app = express()
const PORT = process.env.PORT

// express-handlebars
const exphbs = require('express-handlebars')
const helpers = require('./utils/exphbsHelper')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(cookieParser(process.env.COOKIE_SECRET, {
  httpOnly: true
}))

app.use(methodOverride('_method'))

// Develop logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Parse data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Route
app.use(routes)

// Error handler
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.error(err)
  console.error(`Unhandled Rejection caught: ${err.message}`)
  server.close(() => process.exit(1))
})
