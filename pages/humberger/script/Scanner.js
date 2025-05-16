document.addEventListener('DOMContentLoaded', async function () {
    const absensiTable = document.getElementById('absensiTable').querySelector('tbody');
    const submitButton = document.getElementById('submitAbsensi');
    const statusBox = document.getElementById('statusBox');
    let absensiData = [];

    const html5QrCode = new Html5Qrcode("preview");

    const qrCodeSuccessCallback = async (decodedText, _decodedResult) => {
        const [nama, nisn, kelas] = decodedText.split(',');
       function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];  // hasilnya: "08:15:32"
}

const waktu = getCurrentTime();
const kelasBersih = kelas.trim().replace(/^kelas\s*:\s*/i, '');
const NamaBersih = nama.trim().replace(/^Nama\s*:\s*/i, '');
const NISNBersih = nisn.trim().replace(/^NISN\s*:\s*/i, '');
        const sudahAbsen = absensiData.some(item => item.nisn === nisn.trim());
        if (sudahAbsen) {
            showStatus(`⚠️ ${nama.trim()} sudah discan`, 'warning');
            return;
        }

        const siswa = {
            nama: NamaBersih,
            nisn: NISNBersih,
            kelas: kelasBersih,
            status: 'Masuk',
            waktu
        };

        absensiData.push(siswa);
        renderTable();
        showStatus(`✅ ${siswa.nama} berhasil discan`, 'success');

        await html5QrCode.pause();
        setTimeout(() => html5QrCode.resume(), 1500);
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    Html5Qrcode.getCameras().then(devices => {
        if (devices.length) {
            html5QrCode.start(devices[0].id, config, qrCodeSuccessCallback)
                .catch(err => console.error("Start Error:", err));
        } else {
            showStatus("❌ Kamera tidak ditemukan.", 'error');
        }
    }).catch(err => {
        console.error("Camera Error:", err);
        showStatus("❌ Gagal mengakses kamera.", 'error');
    });

    function renderTable() {
        absensiTable.innerHTML = '';
        absensiData.forEach((siswa, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${siswa.nama}</td>
                <td>${siswa.nisn}</td>
                <td>${siswa.kelas}</td>
                <td>
                    <select class="statusSelect">
                        <option value="Masuk" ${siswa.status === 'Masuk' ? 'selected' : ''}>Masuk</option>
                        <option value="Izin" ${siswa.status === 'Izin' ? 'selected' : ''}>Izin</option>
                        <option value="Sakit" ${siswa.status === 'Sakit' ? 'selected' : ''}>Sakit</option>
                    </select>
                </td>
                <td>${siswa.waktu}</td>
                <td><button class="deleteRow">❌</button></td>
            `;
            absensiTable.appendChild(row);

            row.querySelector('.statusSelect').addEventListener('change', (event) => {
                siswa.status = event.target.value;
                if (siswa.status !== 'Masuk') siswa.waktu = '';
            });

            row.querySelector('.deleteRow').addEventListener('click', () => {
                absensiData.splice(index, 1);
                renderTable();
            });
        });
    }

    submitButton.addEventListener('click', async function () {
        if (absensiData.length === 0) {
            showStatus('⚠️ Tidak ada data untuk dikirim.', 'warning');
            return;
        }

        try {
            const response = await fetch('https://faqih.pythonanywhere.com/api/submit-absensi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(absensiData)
            });

            if (response.ok) {
                alert('✅ Data absensi berhasil disimpan!');
                absensiData = [];
                renderTable();
            } else {
                alert('❌ Gagal menyimpan data absensi.');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            alert('❌ Terjadi kesalahan koneksi.');
        }
    });

    function showStatus(message, type) {
        statusBox.innerText = message;
        statusBox.className = type === 'success' ? 'status success'
                             : type === 'warning' ? 'status warning'
                             : 'status error';
        setTimeout(() => {
            statusBox.innerText = '';
            statusBox.className = '';
        }, 3000);
    }
});
