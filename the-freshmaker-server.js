/**
 * TheFreshmaker server
 * 
 * Auto-reload on server restart.
 * 
 * @author Anthony Bennett <anthonybennett@outlook.com>
 *
 * Usage NodeJs
 *  const TheFreshmaker = require('the-freshmaker')(app)
 * 
 * Usage HTML
 *   <script src="/the-freshmaker-client.js" type="text/javascript"></script>
 */
const express = require("express")
const fs = require('fs')
const router = express.Router()
const startTime = new Date().getTime()

function sendEvent(res, event, data) {
  const payload = [
    `event: ${event}`,
    `id: ${Date.now()}`,
    `data: ${JSON.stringify(data)}`
  ]
  res.write(`${payload.join("\n")}\n\n`)
}

var clientSrc = ""

try {
  clientSrc = fs.readFileSync(`${__dirname}/the-freshmaker-client.js`, 'utf8')
} catch (err) {
  clientSrc = err
  console.log(err)
}

router.get('/the-freshmaker-client.js', (req, res) => {
  res.setHeader("Content-type", "text/javascript")
  res.write(clientSrc)
  res.end()
})

// Route to retrieve the start-time (client -> server)
router.get('/the-freshmaker/start-time', (req, res) => {
  res.json({ startTime })
})

// Router for Server Sent Event (SSEs, server -> client)
router.get("/the-freshmaker/events", (req, res) => {

  // Stay connected longer than normal. (client automatically re-connects)
  const timeout = (10 * 60 * 1000)
  req.connection.setTimeout(timeout, function () {
    console.log("TheFreshmaker: /the-freshmaker/events connection timeout")
  })

  // Let the client know this is an event-stream.
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  // Send one event and keep the the response opened.
  sendEvent(res, "start-time", { startTime })
})

module.exports = function (app) {
  app.use(router)
}