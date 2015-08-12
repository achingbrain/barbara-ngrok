var ngrok = require('@achingbrain/ngrok')
var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

function openTunnel () {
  ngrok.connect({
    proto: process.env.NGROK_PROTOCOL || 'tcp',
    port: process.env.NGROK_PORT || 22,
    authtoken: process.env.NGROK_AUTH_TOKEN
  }, function (error, url) {
    if (error) {
      throw error
    }

    client.post('direct_messages/new', {
      screen_name: process.env.TWITTER_RECIPIENT,
      text: 'I am alive: ' + url
    }, function (error) {
      if (error) {
        throw error
      }
    })
  })
}

ngrok.on('close', function () {
  // wait a little bit, then reopen tunnel
  setTimeout(openTunnel, 1000)
})

openTunnel()
