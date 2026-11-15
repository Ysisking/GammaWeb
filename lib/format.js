// Helper tampilan tanpa dependensi server; aman diimpor komponen klien.
export const rupiah = (n) => (Number(n) > 0 ? 'Rp ' + Number(n).toLocaleString('id-ID') : 'Hubungi kami')
export const waLink = (number, text) => `https://wa.me/${String(number).replace(/\D/g, '')}${text ? '?text=' + encodeURIComponent(text) : ''}`
export const tanggal = (iso) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
