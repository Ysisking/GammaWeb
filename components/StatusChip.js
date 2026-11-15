const MAP = {
  menunggu: ['Menunggu konfirmasi', 'bg-amber-100 text-amber-900'],
  diproses: ['Diproses', 'bg-sky-100 text-sky-900'],
  selesai: ['Selesai', 'bg-emerald-100 text-emerald-900'],
  dibatalkan: ['Dibatalkan', 'bg-ink/10 text-ink/70'],
}
export default function StatusChip({ status }) {
  const [t, c] = MAP[status] || [status, 'bg-ink/10']
  return <span className={`chip flex-none ${c}`}>{t}</span>
}
