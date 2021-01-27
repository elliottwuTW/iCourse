const moment = require('moment')

module.exports = {
  isUndefined: (object) => object === undefined,
  equal: (a, b) => {
    if (typeof a !== 'undefined' && typeof b !== 'undefined') {
      return a.toString() === b.toString()
    }
  },
  notEq: (a, b) => {
    if (typeof a !== 'undefined' && typeof b !== 'undefined') {
      return a.toString() !== b.toString()
    }
  },
  and: (bool1, bool2) => (bool1 && bool2),
  not: (bool) => !bool,
  toFromNowFormat: (time) => moment(time).fromNow()
}
