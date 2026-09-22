# Pembaruan Prototype CECIZ GO Admin

## Tujuan
Memperbarui prototype mock-data agar alur input batch, tracking, dan tagihan tax sesuai revisi terbaru, tanpa menambahkan backend atau logika bisnis di luar rumus yang diberikan.

## Perubahan yang dibangun
1. **Batch & Harga**
   - Ganti input Buyer menjadi pilihan Total PC yang membentuk baris Buyer, Item/Qty, dan harga mata uang asal per buyer secara dinamis.
   - Harga buyer CH/KR/TH dapat berbeda per baris; harga Yen untuk JP bersifat opsional; Rupiah Price INA berada di setiap baris buyer.
   - Tambahkan input Rate negara di form batch dan pilihan Admin Nyelem dari daftar staf.
   - Tambahkan field INA: GO Fee, Total Price, Fee Adm Nyelem, dan Fee Adm Rekap.
   - Buyer-facing hanya menampilkan Harga per Buyer dan Harga Total per buyer.
   - Pindahkan Harga TF Seller dan Selisih Harga ke Internal Calculation.
   - Khusus INA, sembunyikan komponen internal yang tidak berlaku dan tampilkan Laba Bersih sesuai rumus revisi.
   - Tombol simpan menghasilkan ringkasan nominal per buyer dalam format teks.

2. **Tracking**
   - Ubah Warehouse menjadi dropdown.
   - Pertahankan Resi sebagai input manual.
   - Tambahkan Detail Isi Barang dan Nomor Box.

3. **Tagihan Tax**
   - Tambahkan alur Add Tagihan dan Edit Tagihan.
   - Form memilih buyer, periode, deadline, lalu menyusun satu invoice dari beberapa barang/batch.
   - Setiap baris memuat batch, negara, nama barang, jumlah, dan nominal tax per barang.
   - Tampilkan total tagihan per buyer, catatan, status, serta hubungan mock ke bukti pembayaran.
   - Detail invoice menampilkan seluruh barang lintas batch dan aksi edit/generate invoice.

## Teknis
- Semua interaksi memakai state React dan data contoh; tidak ada backend atau pembayaran produksi.
- Gunakan komponen serta gaya visual CECIZ GO yang sudah ada.
- Validasi alur utama dan tampilan desktop/mobile di preview.
