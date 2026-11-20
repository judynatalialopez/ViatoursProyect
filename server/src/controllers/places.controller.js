const db = require('../config/db')
const httpError = require('../utils/httpError')
const toSlug = require('../utils/slug')
const { broadcast } = require('../utils/events')
const { normalizeBranches, assertDestinationsExist } = require('../utils/branches')

/* ---------- helpers ---------- */

const parseId = value => {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) throw httpError(400, 'Identificador inválido')
  return id
}

const withTx = async fn => {
  if (typeof db.getConnection !== 'function') return fn(db)
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()
    const result = await fn(conn)
    await conn.commit()
    return result
  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}

const map = row => ({
  ...row,
  id: Number(row.id),
  destinationId: Number(row.destinationId),
  categoryId: Number(row.categoryId),
  active: Boolean(row.active),
  category: row.categorySlug,
  url: `/internal-site?id=${row.id}`
})

const base = `SELECT p.id, pb.destination_id AS destinationId, p.category_id AS categoryId, p.name, p.slug,
  p.description, p.phone, p.address, p.image, p.active,
  DATE_FORMAT(p.created_at,'%Y-%m-%dT%H:%i:%s') AS date_create, p.updated_at,
  c.name AS categoryName, c.slug AS categorySlug, d.name AS destinationName
  FROM places p
  JOIN place_branches pb ON pb.place_id = p.id AND pb.is_branch = 0
  JOIN categories c ON c.id = p.category_id
  JOIN destinations d ON d.id = pb.destination_id`

const attachBranches = async rows => {
  if (!rows.length) return rows
  const [all] = await db.query(
    `SELECT pb.id, pb.place_id AS placeId, pb.destination_id AS destinationId,
            d.name AS destinationName, pb.is_branch AS isBranch, pb.address, pb.phone
     FROM place_branches pb
     JOIN destinations d ON d.id = pb.destination_id
     WHERE pb.place_id IN (?)
     ORDER BY pb.is_branch, d.name`,
    [rows.map(r => r.id)]
  )
  const byPlace = new Map()
  for (const b of all) {
    const key = Number(b.placeId)
    if (!byPlace.has(key)) byPlace.set(key, [])
    byPlace.get(key).push({
      id: Number(b.id),
      destinationId: Number(b.destinationId),
      destinationName: b.destinationName,
      isBranch: Boolean(b.isBranch),
      address: b.address,
      phone: b.phone
    })
  }
  return rows.map(r => ({ ...r, branches: byPlace.get(Number(r.id)) || [] }))
}

const validateRelations = async (destinationId, categoryId) => {
  const [[destination]] = await db.query('SELECT id FROM destinations WHERE id=? LIMIT 1', [destinationId])
  if (!destination) throw httpError(400, 'El destino seleccionado no existe')
  const [[category]] = await db.query('SELECT id FROM categories WHERE id=? LIMIT 1', [categoryId])
  if (!category) throw httpError(400, 'La categoría seleccionada no existe')
}

const normalizeGallery = value =>
  value.map(item => String(item || '').trim()).filter(Boolean).slice(0, 50)

const saveGallery = async (q, placeId, gallery) => {
  await q.query('DELETE FROM place_images WHERE place_id=?', [placeId])
  if (!gallery.length) return
  const values = gallery.map((url, index) => [placeId, url, index])
  await q.query('INSERT INTO place_images(place_id,image_url,sort_order) VALUES ?', [values])
}

const readBody = body => {
  const safeBody = body && typeof body === 'object' ? body : {}
  const data = {
    destinationId: Number(safeBody.destinationId),
    categoryId: Number(safeBody.categoryId),
    name: String(safeBody.name || '').trim(),
    description: String(safeBody.description || '').trim(),
    phone: String(safeBody.phone || '').trim() || null,
    address: String(safeBody.address || '').trim(),
    image: String(safeBody.image || '').trim(),
    gallery: Array.isArray(safeBody.gallery) ? normalizeGallery(safeBody.gallery) : undefined,
    active: safeBody.active === false ? 0 : 1
  }
  const { destinationId, categoryId, name, description, address, image } = data
  if (!destinationId || !categoryId || !name || !description || !address || !image) {
    throw httpError(400, 'Destino, categoría, nombre, dirección, descripción e imagen son obligatorios')
  }
  return data
}

const handleDbError = err => {
  if (err?.statusCode) return err
  console.error('[places controller error]:', err)
  if (err?.code === 'ER_DATA_TOO_LONG') {
    return httpError(400, 'Uno de los campos excede la longitud permitida en la base de datos')
  }
  if (err?.code === 'ER_DUP_ENTRY') {
    return httpError(400, 'Ya existe un registro con ese valor duplicado')
  }
  if (err?.code === 'ER_NO_REFERENCED_ROW_2') {
    return httpError(400, 'El destino o categoría referenciada no existe')
  }
  return httpError(500, err?.sqlMessage || err?.message || 'Error interno al procesar el lugar')
}

/* ---------- handlers ---------- */

const list = async (req, res, next) => {
  try {
    const clauses = []
    const params = []
    if (req.query.destinationId) {
      clauses.push('p.id IN (SELECT place_id FROM place_branches WHERE destination_id=?)')
      params.push(req.query.destinationId)
    }
    if (req.query.categoryId) {
      clauses.push('p.category_id=?')
      params.push(req.query.categoryId)
    }
    if (req.query.all !== '1') {
      clauses.push('p.active=1', 'c.active=1', 'd.active=1')
    }
    const where = clauses.length ? ` WHERE ${clauses.join(' AND ')}` : ''
    const [rows] = await db.query(`${base}${where} ORDER BY p.created_at DESC, p.name`, params)
    res.json(await attachBranches(rows.map(map)))
  } catch (err) {
    if (typeof next === 'function') return next(handleDbError(err))
    const mapped = handleDbError(err)
    res.status(mapped.statusCode || 500).json({ message: mapped.message })
  }
}

const getOne = async (req, res, next) => {
  try {
    const id = parseId(req.params.id)
    const [[row]] = await db.query(`${base} WHERE p.id=? LIMIT 1`, [id])
    if (!row) throw httpError(404, 'Lugar no encontrado')
    const [images] = await db.query(
      'SELECT image_url AS url FROM place_images WHERE place_id=? ORDER BY sort_order, id',
      [id]
    )
    const [place] = await attachBranches([map(row)])
    res.json({ ...place, gallery: images.map(i => i.url) })
  } catch (err) {
    if (typeof next === 'function') return next(handleDbError(err))
    const mapped = handleDbError(err)
    res.status(mapped.statusCode || 500).json({ message: mapped.message })
  }
}

const create = async (req, res, next) => {
  try {
    const d = readBody(req.body)
    await validateRelations(d.destinationId, d.categoryId)

    const rawBranches = Array.isArray(req.body?.branches) ? req.body.branches : []
    const branches = normalizeBranches(rawBranches).filter(
      b => Number(b.destinationId) !== Number(d.destinationId)
    )
    if (branches.length) {
      await assertDestinationsExist(branches.map(b => b.destinationId))
    }

    const placeId = await withTx(async q => {
      const slug = toSlug(d.name) || `lugar-${Date.now()}`
      const [result] = await q.query(
        'INSERT INTO places(destination_id,category_id,name,slug,description,phone,address,image,active) VALUES(?,?,?,?,?,?,?,?,?)',
        [d.destinationId, d.categoryId, d.name, slug, d.description, d.phone, d.address, d.image, d.active]
      )
      const id = result.insertId

      const rows = [[id, d.destinationId, 0, d.address, d.phone]]
      branches.forEach(b => rows.push([id, b.destinationId, 1, b.address, b.phone]))
      await q.query('INSERT INTO place_branches(place_id,destination_id,is_branch,address,phone) VALUES ?', [rows])

      await saveGallery(q, id, d.gallery || [])
      return id
    })

    broadcast('place', 'created', placeId)
    req.params = { ...(req.params || {}), id: placeId }
    res.status(201)
    return getOne(req, res, next)
  } catch (err) {
    if (typeof next === 'function') return next(handleDbError(err))
    const mapped = handleDbError(err)
    res.status(mapped.statusCode || 500).json({ message: mapped.message })
  }
}

const update = async (req, res, next) => {
  try {
    const id = parseId(req.params.id)
    const d = readBody(req.body)
    await validateRelations(d.destinationId, d.categoryId)

    await withTx(async q => {
      const slug = toSlug(d.name) || `lugar-${id}`
      const [result] = await q.query(
        'UPDATE places SET destination_id=?,category_id=?,name=?,slug=?,description=?,phone=?,address=?,image=?,active=? WHERE id=?',
        [d.destinationId, d.categoryId, d.name, slug, d.description, d.phone, d.address, d.image, d.active, id]
      )
      if (!result.affectedRows) throw httpError(404, 'Lugar no encontrado')

      await q.query('DELETE FROM place_branches WHERE place_id=? AND destination_id=? AND is_branch=1', [
        id,
        d.destinationId
      ])
      const [main] = await q.query(
        'UPDATE place_branches SET destination_id=?, address=?, phone=? WHERE place_id=? AND is_branch=0',
        [d.destinationId, d.address, d.phone, id]
      )
      if (!main.affectedRows) {
        await q.query(
          'INSERT INTO place_branches(place_id,destination_id,is_branch,address,phone) VALUES (?,?,0,?,?)',
          [id, d.destinationId, d.address, d.phone]
        )
      }

      if (d.gallery) await saveGallery(q, id, d.gallery)
    })

    broadcast('place', 'updated', id)
    return getOne(req, res, next)
  } catch (err) {
    if (typeof next === 'function') return next(handleDbError(err))
    const mapped = handleDbError(err)
    res.status(mapped.statusCode || 500).json({ message: mapped.message })
  }
}

const remove = async (req, res, next) => {
  try {
    const id = parseId(req.params.id)
    const [result] = await db.query('DELETE FROM places WHERE id=?', [id])
    if (!result.affectedRows) throw httpError(404, 'Lugar no encontrado')
    broadcast('place', 'deleted', id)
    res.status(204).end()
  } catch (err) {
    if (typeof next === 'function') return next(handleDbError(err))
    const mapped = handleDbError(err)
    res.status(mapped.statusCode || 500).json({ message: mapped.message })
  }
}

module.exports = { list, getOne, create, update, remove }