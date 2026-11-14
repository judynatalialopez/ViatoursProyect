const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const ctrl = require('../controllers/analyticsController');
const auth = require('../middleware/auth'); // middleware de admin

const limiter = rateLimit({ windowMs: 60_000, max: 60 });

router.post('/events', limiter, ctrl.trackEvent);       // público
router.get('/totals', auth, ctrl.getPlaceTotals);       // admin
router.get('/stats', auth, ctrl.getStats);              // admin
router.get('/place/:id', auth, ctrl.getPlaceReport);    // admin

module.exports = router;