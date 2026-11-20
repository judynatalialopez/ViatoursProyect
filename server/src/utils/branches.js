const db = require('../config/db')
const httpError = require('./httpError')

// Acepta [3, 5] o [{ destinationId: 3, address, phone }, ...]
// Devuelve [{ destinationId, address, phone }] sin duplicados
const normalizeBranches = value => {
  const list = Array.isArray(value) ? value : []
  const result = new Map()
  for (const item of list) {
    const obj = item && typeof item === 'object' ? item : { destinationId: item }
    const destinationId = Number(obj.destinationId)
    if (!Number.isInteger(destinationId) || destinationId <= 0) continue
    result.set(destinationId, {
      destinationId,
      address: String(obj.address || '').trim() || null,
      phone: String(obj.phone || '').trim() || null
    })
  }
  return [...result.values()]
}

const assertDestinationsExist = async ids => {
  if (!ids.length) return
  const [found] = await db.query('SELECT id FROM destinations WHERE id IN (?)', [ids])
  if (found.length !== ids.length) throw httpError(400, 'Uno o más destinos seleccionados no existen')
}

module.exports = { normalizeBranches, assertDestinationsExist }