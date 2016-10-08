const cheerio = require('cheerio')
const express = require('express')
const request = require('request')

const app = express()
app.set('port', process.env.PORT || 3000)

app.get('/', function (req, res) {
  // Set our headers so we're up to spec
  res.setHeader('Content-Type', 'text/html')

  // Choose a url to scrape
  let url = 'http://www.upi.com/Odd_News/'

  // Build a promise so we can do all kinds of complicated async things if we
  // need to.
  let requestPromise = new Promise(function (resolve, reject) {
    // GET the url
    request(url, function (err, res, body) {
      // Handle the error
      if (err || !body) {
        reject(err)
      }

      // We'll dump our data in here
      let headlines = []

      // Here's where the magic happens
      // Cheerio is similar to jQuery, but not identical
      // Let's load the body!
      let $ = cheerio.load(body)

      // Here's a selector. Let's iterate over it!
      $('.upi_item').each(function (i, e) {
        // This gets passed into queries so we're only searching this particular
        // element.
        let $this = $(this)
        headlines.push($('span.hl', $this).text())
      })
      resolve(headlines)
    })
  })

  // When our promise is resolved, send the data we grabbed
  requestPromise.then(function (data) {
    res.send('<h3>' + data.join('</h3><h3>') + '</h3>')
  }).catch(function (err) {
  // While we're at it, let's nicely format the error
    res.send('<h3 style="color:red;">Error</h3><p>' + JSON.stringify(err, null, 4) + '</p>')
  })
})

// Start listening and spit out a helpful log
app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode.', app.get('port'), app.get('env'))
})
