const router = require('express').Router()
const branches = require('../controllers/placeBranches.controller')

// AJUSTA solo esta línea (ver abajo)
const auth = require('../middleware/auth')

// wrapper local: envía los errores async al manejador de errores de Express
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

router.get('/places/:placeId/branches', wrap(branches.list))
router.post('/places/:placeId/branches', auth, wrap(branches.create))
router.put('/places/:placeId/branches/:branchId', auth, wrap(branches.update))
router.delete('/places/:placeId/branches/:branchId', auth, wrap(branches.remove))

module.exports = router