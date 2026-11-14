/** Individual place PDF report. Independently editable file. */
import type { CatalogPlace, Destination } from '~/composables/useAdminData'

interface PlaceReport {
  place: { id: number; name: string; category: string }
  from: string
  to: string
  totals: { views: number; clicks: number; uniques: number }
  daily: { day: string; views: number; clicks: number }[]
  devices: { device: string; total: number }[]
}
interface RankingRow { id: number; views: number }
interface Options {
  row: { id: number; name: string }
  places: CatalogPlace[]
  destinations: Destination[]
  ranking: RankingRow[]
  month: string // YYYY-MM
  request: <T>(url: string) => Promise<T>
}

type RGB = [number, number, number]
const GREEN: RGB = [47, 93, 58]
const SOFT: RGB = [232, 238, 231]
const BEIGE: RGB = [243, 239, 231]
const DARK: RGB = [18, 22, 28]
const BORDER: RGB = [210, 210, 205]
const LOGO_URL = '/img/logo-agl.png' // Path relative to the public/ directory
const L = 14
const W = 182
const fmt = (n: number) => n.toLocaleString('es-CO')
const pad = (n: number) => String(n).padStart(2, '0')
const slugify = (text: string) => text.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const monthName = (key: string) => {
  const [y, m] = key.split('-').map(Number) as [number, number]
  const label = new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(new Date(y, m - 1, 1))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const monthLabelFull = (key: string) => {
  const [y, m] = key.split('-').map(Number) as [number, number]
  const label = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' })
    .format(new Date(y, m - 1, 1))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

async function loadLogo(url: string): Promise<{ data: string; ratio: number } | null> {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        canvas.getContext('2d')!.drawImage(img, 0, 0)
        resolve({ data: canvas.toDataURL('image/png'), ratio: canvas.width / canvas.height })
      } catch { resolve(null) }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

async function loadCover(url: string): Promise<string | null> {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 1456
        canvas.height = 384
        const ctx = canvas.getContext('2d')!
        const ratio = Math.max(canvas.width / img.width, canvas.height / img.height)
        const dw = img.width * ratio, dh = img.height * ratio
        ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh)
        resolve(canvas.toDataURL('image/jpeg', 0.9))
      } catch { resolve(null) }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

export async function generatePlaceReport({ row, places, destinations, ranking, month, request }: Options): Promise<void> {
  if (import.meta.server) return
  if (!/^\d{4}-\d{2}$/.test(month)) return // mes inválido o vacío

  const place = places.find(p => p.id === row.id)
  const destination = destinations.find(d => d.id === place?.destinationId)
  const today = new Date()

  const [y, m] = month.split('-').map(Number) as [number, number]
  const lastDay = new Date(y, m, 0).getDate()
  const monthEndISO = `${y}-${pad(m)}-${pad(lastDay)}`

  // Histórico hasta el final del mes seleccionado (no incluye meses posteriores)
  const report = await request<PlaceReport>(
    `/analytics/place/${row.id}?from=2000-01-01&to=${monthEndISO}`,
  )

  const byMonth = new Map<string, number>()
  for (const d of report.daily) {
    const key = d.day.slice(0, 7)
    byMonth.set(key, (byMonth.get(key) || 0) + d.views)
  }

  const totalVisits = report.totals.views
  const thisMonthVisits = byMonth.get(month) || 0

  const prev = new Date(y, m - 2, 1)
  const prevKey = `${prev.getFullYear()}-${pad(prev.getMonth() + 1)}`
  const prevVisits = byMonth.get(prevKey) || 0
  const variation = prevVisits > 0
    ? Math.round(((thisMonthVisits - prevVisits) / prevVisits) * 100)
    : null

  let bestKey = '', bestVisits = 0
  byMonth.forEach((views, key) => { if (views > bestVisits) { bestVisits = views; bestKey = key } })

  // El ranking corresponde al mes mostrado en el dashboard
  const ranked = [...ranking].sort((a, b) => b.views - a.views)
  const rankIndex = ranked.findIndex(r => r.id === row.id)
  const position = rankIndex >= 0 && ranked[rankIndex]!.views > 0 ? `#${rankIndex + 1}` : '—'

  const [{ jsPDF }, tableModule, logo, cover] = await Promise.all([
    import('jspdf'), import('jspdf-autotable'), loadLogo(LOGO_URL),
    place?.image ? loadCover(place.image) : Promise.resolve(null),
  ])
  const autoTable = tableModule.default ?? tableModule.autoTable
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let top = 12

  if (logo) {
    const maxWidth = 26
    const maxHeight = 20
    const w = Math.min(maxWidth, maxHeight * logo.ratio)
    const h = w / logo.ratio
    doc.addImage(logo.data, 'PNG', L, top, w, h)
  }

  // Divider
  top += 28
  doc.setDrawColor(...GREEN)
  doc.setLineWidth(0.6)
  doc.line(L, top, L + W, top)
  top += 11

  // Título
  doc.setFont('times', 'bold')
  doc.setFontSize(23)
  doc.setTextColor(...DARK)
  const lines = doc.splitTextToSize(row.name, W - 8) as string[]
  doc.text(lines, 105, top, { align: 'center' })
  top += Math.max(1, lines.length) * 9 + 1

  // Subtítulo con el mes del reporte
  doc.setFont('times', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(...GREEN)
  doc.text(`Reporte de ${monthLabelFull(month)}`, 105, top + 4, { align: 'center' })
  top += 9

  if (cover) { doc.addImage(cover, 'JPEG', L, top, W, 48); top += 48 }

  function sectionHeader(title: string, y0: number) {
    doc.setFillColor(...GREEN)
    doc.rect(L, y0, W, 8, 'F')
    doc.setFont('times', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(255, 255, 255)
    doc.text(title, L + 4, y0 + 5.6)
  }

  function metric(x: number, y0: number, w: number, h: number, label: string, value: string, fill: RGB, sub?: string) {
    doc.setFillColor(...fill)
    doc.rect(x, y0, w, h, 'F')
    doc.setFont('times', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...DARK)
    doc.text(doc.splitTextToSize(label, w - 8), x + w / 2, y0 + 7, { align: 'center' })
    doc.setFont('times', 'bold')
    doc.setFontSize(19)
    doc.setTextColor(...GREEN)
    doc.text(value, x + w / 2, y0 + 24, { align: 'center' })
    if (sub) {
      doc.setFont('times', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(...DARK)
      doc.text(sub, x + w / 2, y0 + 30, { align: 'center' })
    }
  }

  top += 8
  sectionHeader('Información del lugar', top)
  autoTable(doc, {
    startY: top + 8, margin: { left: L, right: L }, theme: 'grid',
    body: [
      ['Destino:', destination?.name || '—'],
      ['Categoría:', place?.categoryName || report.place.category || '—'],
      ['Estado:', place?.active ? 'Activo' : 'Inactivo'],
    ],
    styles: { font: 'times', fontSize: 10, textColor: DARK, lineColor: BORDER },
    columnStyles: { 0: { fontStyle: 'bold', fillColor: BEIGE, cellWidth: 40 } },
  })
  top = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8

  // Mueve las métricas a otra página si el título o la portada ocupan mucho espacio
  if (top + 8 + 33 * 2 + 20 > 282) { doc.addPage(); top = 16 }

  sectionHeader(`Rendimiento del lugar · ${monthLabelFull(month)}`, top)
  top += 8
  const cw = W / 3, ch = 33
  metric(L, top, cw, ch, `Visitas acumuladas hasta ${monthName(month)}`, fmt(totalVisits), SOFT)
  metric(L + cw, top, cw, ch, `Visitas en ${monthName(month)}`, fmt(thisMonthVisits), SOFT)
  metric(L + 2 * cw, top, cw, ch, `Posición en ${monthName(month)} entre los lugares más consultados`, position, SOFT)
  top += ch + 1
  metric(L, top, W / 2, ch, 'Mes con más consultas', bestKey ? monthName(bestKey) : '—', BEIGE,
    bestKey ? `${fmt(bestVisits)} visitas` : undefined)
  metric(L + W / 2, top, W / 2, ch, `Variación frente a ${monthName(prevKey)}`,
    variation === null ? '—' : `${variation > 0 ? '+' : ''}${variation} %`, BEIGE)
  top += ch + 8

  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.3)
  doc.setFillColor(...BEIGE)
  doc.rect(L, top, 70, 9, 'FD')
  doc.rect(L + 70, top, W - 70, 9)
  doc.setFont('times', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...DARK)
  doc.text('Fecha de generación del reporte:', L + 4, top + 6)
  doc.setFont('times', 'normal')
  doc.text(new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(today),
    L + 70 + (W - 70) / 2, top + 6, { align: 'center' })

  doc.save(`place-report-${slugify(row.name)}-${month}.pdf`)
}