export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''
// Tambahkan basePath ke aset lokal ("/logo.svg"); URL penuh dibiarkan.
export const asset = (u) => (u && u.startsWith('/') && !u.startsWith('//') ? BASE + u : u)
export const OWNER_EMAIL = (process.env.NEXT_PUBLIC_OWNER_EMAIL || 'yatufht@gmail.com').toLowerCase()
