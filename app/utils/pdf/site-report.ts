/** Site-wide PDF report. Shares the visual style of the place report. */
interface RankingRow {
  id: number
  name: string
  category: string
  views: number
  clicks: number
  uniques: number
}
interface Options {
  month: string // YYYY-MM
  monthLabel: string
  agreementCount: number
  totalPlaces: number
  totalViews: number
  ranking: RankingRow[]
}
type RGB = [number, number, number]
const GREEN: RGB = [47, 93, 58]
const SOFT: RGB = [232, 238, 231]
const BEIGE: RGB = [243, 239, 231]
const DARK: RGB = [18, 22, 28]
const BORDER: RGB = [210, 210, 205]
const LOGO_URL = '/img/logo-agl.png' // Path relative to public/
const L = 14
const W = 182
const fmt = (n: number) => n.toLocaleString('es-CO')

async function loadLogo(
  url: string
): Promise<{ data: string; ratio: number } | null> {
  return new Promise((resolve) => {
    const img = new Image()

    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')

        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight

        const ctx = canvas.getContext('2d')

        if (!ctx) {
          resolve(null)
          return
        }

        ctx.drawImage(img, 0, 0)

        resolve({
          data: canvas.toDataURL('image/png'),
          ratio: canvas.width / canvas.height,
        })
      } catch (error) {
        console.error('Error processing PDF logo:', error)
        resolve(null)
      }
    }

    img.onerror = () => {
      console.error('Error loading PDF logo:', url)
      resolve(null)
    }

    img.src = url
  })
}

export async function generateSiteReport({ month, monthLabel, agreementCount, totalPlaces, totalViews, ranking }: Options): Promise<void> {
  if (import.meta.server) return
  const [{ jsPDF }, tableModule, logo] = await Promise.all([
    import('jspdf'), import('jspdf-autotable'), loadLogo(LOGO_URL),
  ])
  const autoTable = tableModule.default ?? tableModule.autoTable
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let top = 12

  if (logo) {
    const maxWidth = 26
    const maxHeight = 20

    // Preserve the actual image aspect ratio
    const w = Math.min(maxWidth, maxHeight * logo.ratio)
    const h = w / logo.ratio

    // Left-aligned logo
    doc.addImage(
      logo.data,
      'PNG',
      L,
      top,
      w,
      h
    )
  }

  // Divider position
  top += 28
  doc.setDrawColor(...GREEN)
  doc.setLineWidth(0.6)
  doc.line(L, top, L + W, top)
  top += 14
  doc.setFont('times', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...DARK)
  doc.text('Reporte mensual del sitio', 105, top, { align: 'center' })
  top += 9
  doc.setFont('times', 'normal')
  doc.setFontSize(11)
  doc.text(`Periodo: ${monthLabel}`, 105, top, { align: 'center' })
  top += 13

  function sectionHeader(title: string, y0: number) {
    doc.setFillColor(...GREEN)
    doc.rect(L, y0, W, 8, 'F')
    doc.setFont('times', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(255, 255, 255)
    doc.text(title, L + 4, y0 + 5.6)
  }
  function metric(x: number, y0: number, w: number, label: string, value: string, fill: RGB) {
    doc.setFillColor(...fill)
    doc.rect(x, y0, w, 33, 'F')
    doc.setFont('times', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...DARK)
    doc.text(doc.splitTextToSize(label, w - 8), x + w / 2, y0 + 7, { align: 'center' })
    doc.setFont('times', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(...GREEN)
    doc.text(value, x + w / 2, y0 + 24, { align: 'center' })
  }

  sectionHeader('Resumen del sitio', top)
  top += 8
  metric(L, top, W / 3, 'Total de lugares', fmt(totalPlaces), SOFT)
  metric(L + W / 3, top, W / 3, 'Lugares con convenio', fmt(agreementCount), SOFT)
  metric(L + 2 * W / 3, top, W / 3, 'Vistas del período', fmt(totalViews), SOFT)
  top += 42
  sectionHeader('Rendimiento por lugar', top)
  top += 8

  // Monthly ranking with all places from the analytics response.
  const sorted = [...ranking].sort((a, b) => b.views - a.views)
  autoTable(doc, {
    startY: top,
    margin: { left: L, right: L, bottom: 18 },
    head: [['#', 'Lugar', 'Categoría', 'Vistas']],
    body: sorted.map((r, i) => [String(i + 1), r.name, r.category, fmt(r.views)]),
    theme: 'grid',
    styles: { font: 'times', fontSize: 10, textColor: DARK, lineColor: BORDER, cellPadding: 3 },
    headStyles: { fillColor: GREEN, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: BEIGE },
    columnStyles: {
      0: { cellWidth: 13, halign: 'center' },
      1: { cellWidth: 91 },
      2: { cellWidth: 48 },
      3: { cellWidth: 30, halign: 'right' },
    },
    didDrawPage: () => {
      // Consistent footer on each table page.
      const pageHeight = doc.internal.pageSize.getHeight()
      const pageWidth = doc.internal.pageSize.getWidth()
      doc.setDrawColor(...BORDER)
      doc.line(L, pageHeight - 14, pageWidth - L, pageHeight - 14)
      doc.setTextColor(...DARK)
      doc.setFont('times', 'normal')
      doc.setFontSize(9)
      doc.text(`Periodo: ${monthLabel}`, L, pageHeight - 9)
      doc.text(`Página ${doc.getNumberOfPages()}`, pageWidth - L, pageHeight - 9, { align: 'right' })
    },
  })
  const last = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY
  if (last + 21 > 280) { doc.addPage(); top = 18 } else { top = last + 9 }
  doc.setDrawColor(...BORDER)
  doc.setFillColor(...BEIGE)
  doc.rect(L, top, 70, 9, 'FD')
  doc.rect(L + 70, top, W - 70, 9)
  doc.setTextColor(...DARK)
  doc.setFont('times', 'bold')
  doc.setFontSize(10)
  doc.text('Fecha de generación del reporte:', L + 4, top + 6)
  doc.setFont('times', 'normal')
  doc.text(new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(new Date()),
    L + 70 + (W - 70) / 2, top + 6, { align: 'center' })
  doc.save(`site-report-${month}.pdf`)
}
