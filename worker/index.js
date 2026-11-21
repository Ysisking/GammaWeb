// Worker toko: menayangkan berkas statis dari out/ dan, lewat jadwal (cron),
// menjaga keempat database Supabase tetap aktif.
//
// Supabase menjeda project paket gratis yang sepi selama 7 hari. Beberapa
// permintaan ke database tiap hari cukup untuk mencegahnya, jadi jadwal ini
// membaca satu baris dari tiap project dua kali sehari.
//
// Semua kunci di bawah adalah kunci publik (publishable/anon). Kunci ini memang
// ikut terkirim ke browser oleh tiap situs; akses data tetap dijaga Row Level
// Security di masing-masing database. Jangan taruh kunci service_role di sini.

export const PROJECTS = [
  { nama: 'toko', url: 'https://mrzqpfztympuxvrgklxz.supabase.co', tabel: 'gw_products', kunci: 'sb_publishable_Yon3ZdjKBp6OetJNhhacWw_N2JIiRqC' },
  { nama: 'moneyout', url: 'https://nrzvlugmkztqfqlnpxok.supabase.co', tabel: 'mo_categories', kunci: 'sb_publishable_oiQurMzJoA8ksThEYNbcxA_TW2Jg2lp' },
  { nama: 'undangan', url: 'https://whiwdmwseusrilhsqbbl.supabase.co', tabel: 'undangan', kunci: 'sb_publishable_WIbNYGqMaCKmryQt2BesDQ_7ekf3alR' },
  { nama: 'orderbook', url: 'https://kqrpeeybymmbwnnvnbhs.supabase.co', tabel: 'testimonials', kunci: 'sb_publishable_AfFUa_a6OGzU-TvRyKxpbw_uB8r_KUK' },
]

export async function ping(p) {
  const mulai = Date.now()
  try {
    const res = await fetch(`${p.url}/rest/v1/${p.tabel}?select=*&limit=1`, {
      headers: { apikey: p.kunci, Authorization: `Bearer ${p.kunci}` },
      signal: AbortSignal.timeout(20000),
    })
    return { nama: p.nama, status: res.status, ok: res.ok, ms: Date.now() - mulai }
  } catch (e) {
    return { nama: p.nama, status: 0, ok: false, ms: Date.now() - mulai, galat: String(e && e.message || e) }
  }
}

export default {
  // Semua permintaan halaman diteruskan ke berkas statis (termasuk halaman 404).
  async fetch(request, env) {
    return env.ASSETS.fetch(request)
  },

  async scheduled(_event, _env, ctx) {
    ctx.waitUntil(
      Promise.all(PROJECTS.map(ping)).then((hasil) => {
        // Tampil di Cloudflare > gammaweb > Observability > Logs.
        for (const h of hasil) console.log(`[keep-alive] ${h.nama}: ${h.ok ? 'OK' : 'GAGAL'} (HTTP ${h.status}, ${h.ms} ms)${h.galat ? ' ' + h.galat : ''}`)
      })
    )
  },
}
