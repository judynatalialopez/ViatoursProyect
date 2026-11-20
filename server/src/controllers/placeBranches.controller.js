const db = require('../config/db')
const httpError = require('../utils/httpError')
const { broadcast } = require('../utils/events')
const { normalizeBranches, assertDestinationsExist } = require('../utils/branches')

const getPlaceMain = async placeId => {
  const [[row]] = await db.query(
    `SELECT p.id, pb.destination_id AS mainDestinationId
     FROM places p
     JOIN place_branches pb ON pb.place_id = p.id AND pb.is_branch = 0
     WHERE p.id = ? LIMIT 1`,
    [placeId]
  )
  if (!row) throw httpError(404, 'Lugar no encontrado')
  return row
}

const list = async (req, res) => {
  await getPlaceMain(req.params.placeId)
  const [rows] = await db.query(
    `SELECT pb.id, pb.place_id AS placeId, pb.destination_id AS destinationId,
            d.name AS destinationName, d.slug AS destinationSlug,
            pb.is_branch AS isBranch, pb.address, pb.phone
     FROM place_branches pb
     JOIN destinations d ON d.id = pb.destination_id
     WHERE pb.place_id = ?
     ORDER BY pb.is_branch, d.name`,
    [req.params.placeId]
  )
  res.json(rows.map(r => ({ ...r, id: Number(r.id), isBranch: Boolean(r.isBranch) })))
}


const create = async (req, res) => {
  const placeId = Number(req.params.placeId)
  const branches = normalizeBranches(req.body.branches)
  if (!branches.length) throw httpError(400, 'Debes enviar al menos una sucursal')

  const { mainDestinationId } = await getPlaceMain(placeId)
  if (branches.some(b => b.destinationId === Number(mainDestinationId))) {
    throw httpError(400, 'El destino de la sede principal no puede registrarse como sucursal')
  }

  await assertDestinationsExist(branches.map(b => b.destinationId))

  const values = branches.map(b => [placeId, b.destinationId, 1, b.address, b.phone])
  await db.query(
    `INSERT INTO place_branches(place_id,destination_id,is_branch,address,phone) VALUES ?
     ON DUPLICATE KEY UPDATE address=VALUES(address), phone=VALUES(phone)`,
    [values]
  )

  broadcast('place', 'updated', placeId)
  res.status(201)
  return list(req, res)
}

// Body: { address, phone }
const update = async (req, res) => {
  const address = String(req.body.address || '').trim() || null
  const phone = String(req.body.phone || '').trim() || null
  const [result] = await db.query(
    'UPDATE place_branches SET address=?, phone=? WHERE id=? AND place_id=? AND is_branch=1',
    [address, phone, req.params.branchId, req.params.placeId]
  )
  if (!result.affectedRows) throw httpError(404, 'Sucursal no encontrada')
  broadcast('place', 'updated', Number(req.params.placeId))
  return list(req, res)
}

const remove = async (req, res) => {
  const [result] = await db.query(
    'DELETE FROM place_branches WHERE id=? AND place_id=? AND is_branch=1',
    [req.params.branchId, req.params.placeId]
  )
  if (!result.affectedRows) throw httpError(404, 'Sucursal no encontrada')
  broadcast('place', 'updated', Number(req.params.placeId))
  res.status(204).end()
}

module.exports = { list, create, update, remove }