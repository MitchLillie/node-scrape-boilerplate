const cheerio = require('cheerio')
const express = require('express')
const request = require('request')
const app = express()

app.set('port', process.env.PORT || 3000)

app.get('/', function (req, res) {
  // res.setHeader('Content-Type', 'text/html')

  let url = 'http://www.upi.com/Odd_News/'
  let promise = new Promise(function (resolve, reject) {
    request(url, function (err, res, body) {
      if (err || !body) {
        reject(err)
      }
      let headlines = []
      let $ = cheerio.load(body)
      $('.upi_item').each(function (i, e) {
        let $this = $(this)
        headlines.push($('span.hl', $this).text())
      })
      resolve(headlines)
    })
  })
  promise.then(function (data) {
    res.send('<h3>' + data.join('</h3><h3>') + '</h3>')
  }).catch(function (err) {
    throw new Error(err)
  })
})

app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode.', app.get('port'), app.get('env'))
})
