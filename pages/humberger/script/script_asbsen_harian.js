document.addEventListener('DOMContentLoaded', async function () {
    const sudahScanTable = document.getElementById('sudahScanTable').querySelector('tbody');
    const belumScanTable = document.getElementById('belumScanTable').querySelector('tbody');
    const submitButton = document.getElementById('submitAbsensiOrtu');
    const lihatDataOrtuButton = document.getElementById('lihatDataOrtu');
    const ortuTable = document.getElementById('ortuTable').querySelector('tbody');
    const kirimWAButton = document.getElementById('kirimWA');

    // Ambil data siswa yang sudah scan
    async function fetchSudahScan() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/absensi-sudah-scan', {
                method: 'GET',
                credentials: 'include' // Pastikan cookie dikirim
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Data siswa yang sudah scan:", data);

            sudahScanTable.innerHTML = '';
            data.forEach((siswa, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${siswa.nama}</td>
                    <td>${siswa.status}</td>
                    <td>${siswa.waktu}</td>
                `;
                sudahScanTable.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Ambil data siswa yang belum scan
    async function fetchBelumScan() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/absensi-belum-scan', {
                method: 'GET',
                credentials: 'include' // Pastikan cookie dikirim
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Data siswa yang belum scan:", data);

            belumScanTable.innerHTML = '';
            data.forEach((siswa, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${siswa.nama}</td>
                    <td>
                        <select class="statusSelect">
                            <option value="Izin">Izin</option>
                            <option value="Sakit">Sakit</option>
                        </select>
                    </td>
                `;
                belumScanTable.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Fungsi untuk memuat data dari tabel absensi_harian_ortu
    async function fetchDataOrtu() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/lihat-absensi-ortu', {
                method: 'GET',
                credentials: 'include' // Pastikan cookie dikirim
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Data dari absensi_harian_ortu:", data);

            ortuTable.innerHTML = '';
            data.forEach((siswa, index) => {
                // Format waktu: hilangkan 00:00:00 atau tampilkan tanda "-"
                const waktu = siswa.waktu === "00:00:00 GMT" || !siswa.waktu ? '-' : siswa.waktu.split(' ')[0];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${siswa.nama}</td>
                    <td>${siswa.status}</td>
                    <td>${siswa.tanggal}</td>
                    <td>${waktu}</td>
                `;
                ortuTable.appendChild(row);
            });

            // Tampilkan tabel
            document.getElementById('ortuTable').style.display = 'table';
        } catch (error) {
            console.error("Error fetching data ortu:", error);
        }
    }

    // Event listener untuk tombol "Lihat Data Absensi Orang Tua"
    lihatDataOrtuButton.addEventListener('click', fetchDataOrtu);

    // Submit data siswa yang sudah scan dan belum scan
    submitButton.addEventListener('click', async function () {
        // Ambil data siswa yang sudah scan
        const rowsSudahScan = sudahScanTable.querySelectorAll('tr');
        const dataSudahScan = Array.from(rowsSudahScan).map(row => {
            const nama = row.cells[1].textContent;
            const status = row.cells[2].textContent;
            const waktu = row.cells[3].textContent;
            const today = new Date().toISOString().split('T')[0];
            return { nama, status, waktu, tanggal: today };
        });

        // Ambil data siswa yang belum scan
        const rowsBelumScan = belumScanTable.querySelectorAll('tr');
        const dataBelumScan = Array.from(rowsBelumScan).map(row => {
            const nama = row.cells[1].textContent;
            const status = row.querySelector('.statusSelect').value;
            const today = new Date().toISOString().split('T')[0];
            const waktu = new Date().toLocaleTimeString('id-ID', { hour12: false }); // Waktu real-time
            return { nama, status, waktu, tanggal: today };
        });

        // Gabungkan data siswa yang sudah scan dan belum scan
        const dataToSubmit = [...dataSudahScan, ...dataBelumScan];

        console.log("Data yang akan dikirim ke backend:", dataToSubmit); // Debugging

        try {
            const response = await fetch('http://127.0.0.1:5000/api/submit-absensi-ortu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',  // Pastikan cookie dikirim
                body: JSON.stringify(dataToSubmit)
            });

            if (response.ok) {
                alert('Data berhasil disimpan ke absensi_harian_ortu!');
            } else {
                alert('Gagal menyimpan data!');
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    });

    // Fungsi untuk mengirim data ke WhatsApp
    kirimWAButton.addEventListener('click', async function () {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/kirim-wa-absensi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' // Pastikan cookie dikirim
            });

            if (response.ok) {
                alert('Pesan berhasil dikirim ke WhatsApp!');
            } else {
                alert('Gagal mengirim pesan ke WhatsApp!');
            }
        } catch (error) {
            console.error("Error mengirim data ke WhatsApp:", error);
        }
    });

    // Panggil fungsi untuk mengambil data
    fetchSudahScan();
    fetchBelumScan();
});