const express = require('express')
const request = require('request')
const app = express()

app.set('port', process.env.PORT || 3000)

app.get('/', function (req, res) {
  var url = 'http://www.upi.com/Odd_News/'
  request(url, function (err, res, body) {
    console.log("body: ", body)
  })
})

app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode.', app.get('port'), app.get('env'))
})
