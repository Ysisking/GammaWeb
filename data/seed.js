// Isi awal situs. Dipakai langsung saat Supabase belum diatur, dan disalin ke
// database lewat supabase/gammaweb.sql saat Supabase diaktifkan.
export const SEED = {
  settings: {
    username: 'gammaproject',
    nama_usaha: 'gammaproject official store',
    tagline: 'Website, produk digital, dan layanan buatan gammaproject.',
    deskripsi: 'Toko resmi gammaproject. Semua website, produk digital, dan layanan di sini dibuat dan dikelola langsung oleh pemiliknya. Lihat-lihat dulu sepuasnya; akun baru diperlukan saat Anda memesan.',
    sampul_url: '/sampul-default.jpg',
    foto_profil_url: '/profil-default.jpg',
    wa_number: '6287821130367',
    email: 'yatufht@gmail.com',
    owner: {
      nama: 'Taufik',
      jabatan: 'Pemilik gammaproject',
      bio: 'Membangun website dan produk digital untuk usaha kecil agar tampil meyakinkan sejak detik pertama.',
      foto_url: '',
      instagram: '',
    },
    tentang: 'gammaproject adalah studio kecil yang membuat website, aplikasi, dan produk digital untuk usaha kecil dan perorangan.\n\nSetiap pesanan dikerjakan langsung oleh pemilik, jadi Anda berkomunikasi dengan orang yang benar-benar membuat pesanan Anda.',
    // Teks kebijakan hasil suntingan pemilik: { 'ketentuan-layanan': '...' }. Kosong = pakai naskah bawaan.
    kebijakan: {},
  },
  // Sub-menu katalog. Ketiganya selalu tampil walau belum ada isinya.
  categories: [
    { id: 'seed-website', nama: 'Website', slug: 'website', jenis: 'jasa', urutan: 1 },
    { id: 'seed-produk', nama: 'Produk', slug: 'produk', jenis: 'produk', urutan: 2 },
    { id: 'seed-layanan', nama: 'Layanan', slug: 'layanan', jenis: 'jasa', urutan: 3 },
  ],
  products: [
    { id: 'seed-p1', slug: 'madhura-rekap', nama: 'Madhura Rekap', jenis: 'jasa', kategori_id: 'seed-website', harga: 0, harga_coret: 0, urutan: 1, gambar_url: '/produk-madhura.jpg', aktif: true, contoh: true,
      link: 'https://madura-bisnis.preview.emergentagent.com/?utm_source=share',
      ringkas: 'Rekap pemasukan dan pengeluaran harian semua cabang usaha dalam satu tempat.',
      deskripsi: 'Website rekap harian untuk usaha dengan banyak cabang. Pengurus cabang mengisi rekap, pemilik melihat semuanya dari satu dasbor.',
      fitur: ['Rekap harian per cabang', 'Dasbor untuk pemilik usaha', 'Bisa dibuka dari ponsel'] },
    { id: 'seed-p2', slug: 'mycash', nama: 'MyCash', jenis: 'jasa', kategori_id: 'seed-website', harga: 0, harga_coret: 0, urutan: 2, gambar_url: '/produk-mycash.jpg', aktif: true, contoh: true,
      link: 'https://mycash-nine.vercel.app',
      ringkas: 'Catat uang usahamu, apa pun jenis bisnisnya.',
      deskripsi: 'Aplikasi web pencatatan keuangan usaha. Pemilik melihat semua cabang dan dasbor, pengurus cabang mengisi rekap harian. Data tersimpan di akun, jadi ganti HP pun rekap tetap ada.',
      fitur: ['Masuk sebagai pemilik usaha atau pengurus cabang', 'Rekap semua cabang dalam satu tempat', 'Tersedia dalam bahasa Indonesia dan Inggris'] },
    { id: 'seed-p4', slug: 'moneyout', nama: 'MoneyOut', jenis: 'jasa', kategori_id: 'seed-website', harga: 0, harga_coret: 0, urutan: 3, gambar_url: '/produk-moneyout.jpg', aktif: true, contoh: false,
      link: 'https://moneyout.gamma-tau.workers.dev',
      ringkas: 'Catat pemasukan, pengeluaran, simpanan, dan hutang pribadi dalam satu aplikasi.',
      deskripsi: 'Aplikasi web keuangan pribadi untuk pekerja kantoran, freelancer, sampai mahasiswa. Catat gaji dan penghasilan harian, belanja sehari-hari, tabungan, investasi, hutang-piutang, dan aset. Data Analyst membaca catatanmu lalu memberi kesimpulan, risiko, dan peluang setiap bulan.',
      fitur: ['Banyak dompet: tunai, rekening bank, dan e-wallet', 'Anggaran per kategori dengan sisa jatah per hari', 'Data Analyst: skor kesehatan keuangan dan saran otomatis', 'Kekayaan bersih dari saldo, aset, dan hutang'] },
    { id: 'seed-p3', slug: 'undangan-digital', nama: 'Undangan Digital', jenis: 'jasa', kategori_id: 'seed-layanan', harga: 0, harga_coret: 0, urutan: 4, gambar_url: '/produk-undangan.jpg', aktif: true, contoh: true,
      link: 'https://undangan-studio-theta.vercel.app/',
      ringkas: 'Undangan pernikahan online dengan banyak pilihan desain dan nama tamu di sampul.',
      deskripsi: 'Pilih desain dari etalase undangan, kirim data acara dan foto, lalu undangan siap dibagikan lewat WhatsApp dengan nama tamu masing-masing.',
      fitur: ['Banyak pilihan desain, dari adat sampai modern', 'Nama tamu otomatis dari link', 'Demo langsung bisa dicoba sebelum memesan'] },
  ],
}
