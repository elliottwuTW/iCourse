module.exports = (fetchResult, res, renderPage, renderParam) => {
  if (fetchResult.status === 'success') {
    return res.render(renderPage, renderParam)
  } else {
    return res.send(fetchResult.message)
  }
}
