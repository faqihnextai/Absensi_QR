document.getElementById('formTambahSiswa').addEventListener('submit', async function (event) {
    event.preventDefault(); // Mencegah reload halaman

    const nama = document.getElementById('nama').value;
    const nisn = document.getElementById('nisn').value;
    const kelas = document.getElementById('kelas').value;
    const nomorOrtu = document.getElementById('nomor_ortu').value;

    const data = {
        nama: nama,
        nisn: nisn,
        kelas: kelas,
        nomor_ortu: nomorOrtu
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/api/tambah-siswa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Data siswa berhasil disimpan!');

            // Tampilkan QR Code
            const qrCodeContainer = document.getElementById('qrCodeContainer');
            qrCodeContainer.innerHTML = `<img src="http://127.0.0.1:5000${result.qr_code}" alt="QR Code Siswa">`;

            document.getElementById('formTambahSiswa').reset(); // Reset form setelah berhasil
        } else {
            alert('Gagal menyimpan data siswa.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menyimpan data.');
    }
});