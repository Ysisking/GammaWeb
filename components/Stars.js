import { Star } from 'lucide-react'
export default function Stars({ n = 0, size = 16 }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} className={i <= n ? 'fill-amber-400 text-amber-400' : 'text-ink/20'} />)}
    </span>
  )
}
