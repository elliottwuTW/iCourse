module.exports = {
  equal: (a, b) => {
    if (typeof a !== 'undefined' && typeof b !== 'undefined') {
      return a.toString() === b.toString()
    }
  },
  notEq: (a, b) => {
    if (typeof a !== 'undefined' && typeof b !== 'undefined') {
      return a.toString() !== b.toString()
    }
  }
}
