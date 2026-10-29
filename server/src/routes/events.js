const router = require('express').Router()
const { addClient } = require('../utils/events')

router.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  res.flushHeaders()
  res.write('retry: 3000\n\n')

  addClient(res)

  // Azure corta conexiones inactivas (~230 s), por eso el latido
  const heartbeat = setInterval(() => res.write(': ping\n\n'), 25000)
  req.on('close', () => clearInterval(heartbeat))
})

module.exports = router