const MAP = {
  menunggu: ['Menunggu konfirmasi', 'bg-amber-100 text-amber-800'],
  diproses: ['Diproses', 'bg-blue-100 text-blue-800'],
  selesai: ['Selesai', 'bg-emerald-100 text-emerald-800'],
  dibatalkan: ['Dibatalkan', 'bg-ink/10 text-ink/60'],
}
export default function StatusChip({ status }) {
  const [t, c] = MAP[status] || [status, 'bg-ink/10']
  return <span className={`chip ${c}`}>{t}</span>
}
