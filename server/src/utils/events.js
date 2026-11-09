const clients = new Set()

const addClient = (res) => {
  clients.add(res)
  res.on('close', () => clients.delete(res))
}

const broadcast = (entity, action, id) => {
  const data = `event: catalog\ndata: ${JSON.stringify({ entity, action, id })}\n\n`
  for (const client of clients) client.write(data)
}

module.exports = { addClient, broadcast }