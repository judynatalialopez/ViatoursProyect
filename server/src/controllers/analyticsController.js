// server/src/controllers/analyticsController.js
const pool = require('../config/db'); // ajusta a tu archivo real de conexión
const IS_AGREEMENT = `LOWER(TRIM(c.name)) = 'convenio'`;

const EVENTS = ['view', 'click', 'favorite'];
const DEVICES = ['mobile', 'desktop', 'tablet'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const getRange = (query) => {
  const today = new Date().toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const from = DATE_RE.test(query.from) ? query.from : monthAgo;
  const to = DATE_RE.test(query.to) ? query.to : today;
  return { from, to };
};

/**
 * POST /analytics/events  (público)
 */
exports.trackEvent = async (req, res) => {
  try {
    const { placeId, visitorId, eventType = 'view', device = null } = req.body;

    if (
      !Number.isInteger(placeId) ||
      typeof visitorId !== 'string' ||
      visitorId.length !== 36 ||
      !EVENTS.includes(eventType) ||
      (device && !DEVICES.includes(device))
    ) {
      return res.sendStatus(400);
    }

    const [place] = await pool.query(
  `SELECT p.id FROM places p
   JOIN categories c ON c.id = p.category_id
   WHERE p.id = ? AND p.active = 1 AND ${IS_AGREEMENT}`,
  [placeId]
);
if (!place.length) return res.sendStatus(204);
    // Anti-inflado: mismo visitante, lugar y evento en los últimos 30 min
    const [dup] = await pool.query(
      `SELECT 1 FROM place_views
       WHERE place_id = ? AND visitor_id = ? AND event_type = ?
         AND created_at > NOW() - INTERVAL 10 SECOND
       LIMIT 1`,
      [placeId, visitorId, eventType]
    );
    if (dup.length) return res.sendStatus(204);

    await pool.query(
      'INSERT INTO place_views (place_id, visitor_id, event_type, device) VALUES (?,?,?,?)',
      [placeId, visitorId, eventType, device]
    );

    res.sendStatus(204);
  } catch (err) {
    console.error('trackEvent error:', err);
    res.sendStatus(500);
  }
};

/**
 * GET /analytics/stats?from=YYYY-MM-DD&to=YYYY-MM-DD  (admin)
 */
exports.getStats = async (req, res) => {
  try {
    const { from, to } = getRange(req.query);

    const [ranking] = await pool.query(
  `SELECT p.id, p.name, c.name AS category,
          COALESCE(SUM(v.event_type = 'view'), 0)  AS views,
          COALESCE(SUM(v.event_type = 'click'), 0) AS clicks,
          COUNT(DISTINCT CASE WHEN v.event_type = 'view' THEN v.visitor_id END) AS uniques
   FROM places p
   JOIN categories c ON c.id = p.category_id
   LEFT JOIN place_views v ON v.place_id = p.id
        AND v.created_at >= ? AND v.created_at < ? + INTERVAL 1 DAY
   WHERE ${IS_AGREEMENT}
   GROUP BY p.id, p.name, c.name
   ORDER BY views DESC`,
  [from, to]
);

const [daily] = await pool.query(
  `SELECT DATE_FORMAT(v.created_at, '%Y-%m-%d') AS day, COUNT(*) AS views
   FROM place_views v
   JOIN places p ON p.id = v.place_id
   JOIN categories c ON c.id = p.category_id
   WHERE v.event_type = 'view' AND ${IS_AGREEMENT}
     AND v.created_at >= ? AND v.created_at < ? + INTERVAL 1 DAY
   GROUP BY day
   ORDER BY day`,
  [from, to]
);

const [devices] = await pool.query(
  `SELECT COALESCE(v.device, 'unknown') AS device, COUNT(*) AS total
   FROM place_views v
   JOIN places p ON p.id = v.place_id
   JOIN categories c ON c.id = p.category_id
   WHERE ${IS_AGREEMENT}
     AND v.created_at >= ? AND v.created_at < ? + INTERVAL 1 DAY
   GROUP BY device`,
  [from, to]
);

    res.json({
      ranking: ranking.map(r => ({
        ...r,
        views: Number(r.views),
        clicks: Number(r.clicks),
        uniques: Number(r.uniques),
      })),
      daily: daily.map(r => ({ ...r, views: Number(r.views) })),
      devices: devices.map(r => ({ ...r, total: Number(r.total) })),
    });
  } catch (err) {
    console.error('getStats error:', err);
    res.sendStatus(500);
  }
};

/**
 * GET /analytics/place/:id?from=&to=  (admin)
 */
exports.getPlaceReport = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.sendStatus(400);
    const { from, to } = getRange(req.query);

    const [placeRows] = await pool.query(
      `SELECT p.id, p.name, c.name AS category
       FROM places p JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`,
      [id]
    );
    if (!placeRows.length) return res.sendStatus(404);

    const [totalsRows] = await pool.query(
      `SELECT COALESCE(SUM(event_type = 'view'), 0)  AS views,
              COALESCE(SUM(event_type = 'click'), 0) AS clicks,
              COUNT(DISTINCT CASE WHEN event_type = 'view' THEN visitor_id END) AS uniques
       FROM place_views
       WHERE place_id = ? AND created_at >= ? AND created_at < ? + INTERVAL 1 DAY`,
      [id, from, to]
    );

    const [daily] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day,
              SUM(event_type = 'view')  AS views,
              SUM(event_type = 'click') AS clicks
       FROM place_views
       WHERE place_id = ? AND created_at >= ? AND created_at < ? + INTERVAL 1 DAY
       GROUP BY day
       ORDER BY day`,
      [id, from, to]
    );

    const [devices] = await pool.query(
      `SELECT COALESCE(device, 'unknown') AS device, COUNT(*) AS total
       FROM place_views
       WHERE place_id = ? AND created_at >= ? AND created_at < ? + INTERVAL 1 DAY
       GROUP BY device`,
      [id, from, to]
    );

    const t = totalsRows[0];
    res.json({
      place: placeRows[0],
      from,
      to,
      totals: { views: Number(t.views), clicks: Number(t.clicks), uniques: Number(t.uniques) },
      daily: daily.map(r => ({ day: r.day, views: Number(r.views), clicks: Number(r.clicks) })),
      devices: devices.map(r => ({ ...r, total: Number(r.total) })),
    });
  } catch (err) {
    console.error('getPlaceReport error:', err);
    res.sendStatus(500);
  }
};

/**
 * GET /analytics/totals  (admin)
 */
exports.getPlaceTotals = async (req, res) => {
  try {
    const hasRange = DATE_RE.test(req.query.from) || DATE_RE.test(req.query.to);
    const { from, to } = getRange(req.query);

    const dateFilter = hasRange
      ? 'AND v.created_at >= ? AND v.created_at < ? + INTERVAL 1 DAY'
      : '';
    const params = hasRange ? [from, to] : [];

    const [rows] = await pool.query(
      `SELECT p.id AS placeId,
              COALESCE(SUM(v.event_type = 'view'), 0)     AS views,
              COALESCE(SUM(v.event_type = 'click'), 0)    AS clicks,
              COALESCE(SUM(v.event_type = 'favorite'), 0) AS favorites,
              COUNT(DISTINCT CASE WHEN v.event_type = 'view' THEN v.visitor_id END) AS uniques
       FROM places p
          JOIN categories c ON c.id = p.category_id
          LEFT JOIN place_views v ON v.place_id = p.id ${dateFilter}
          WHERE ${IS_AGREEMENT}
          GROUP BY p.id`
    );

    res.json(
      rows.map(r => ({
        placeId: r.placeId,
        views: Number(r.views),
        clicks: Number(r.clicks),
        favorites: Number(r.favorites),
        uniques: Number(r.uniques),
      }))
    );
  } catch (err) {
    console.error('getPlaceTotals error:', err);
    res.sendStatus(500);
  }
};