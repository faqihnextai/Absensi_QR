document.addEventListener('DOMContentLoaded', async function () {
    const qrTableBody = document.getElementById('qrTableBody');
    const isMobile = window.innerWidth <= 600;

    try {
        // Ambil data siswa dari API
        const response = await fetch('https://faqih.pythonanywhere.com/api/siswa/qrcode', {
            credentials: 'include'  // Pastikan cookie dikirim
        });
        if (!response.ok) {
            throw new Error('Gagal mengambil data siswa');
        }

        const studentsData = await response.json();

        // Tampilkan data siswa di tabel
        if (qrTableBody && studentsData.length > 0) {
            studentsData.forEach((student, index) => {
                const row = qrTableBody.insertRow();

                // Kolom No
                const noCell = row.insertCell();
                noCell.textContent = index + 1;

                // Kolom Nama
                const nameCell = row.insertCell();
                nameCell.textContent = student.nama;

                if (!isMobile) {
                    // Kolom QR Code (hanya desktop/tablet)
                    const qrCell = row.insertCell();
                    const qrImg = document.createElement('img');
                    qrImg.src = `http://127.0.0.1:5000${student.qr_code_url}`;
                    qrImg.alt = `QR Code ${student.nama}`;
                    qrImg.width = 100;
                    qrImg.height = 100;
                    qrCell.appendChild(qrImg);
                }

                // Kolom Download
                const downloadCell = row.insertCell();
                const downloadLink = document.createElement('a');
                downloadLink.textContent = 'Download';
                downloadLink.href = `https://faqih.pythonanywhere.com/download/qr/${student.nisn}`;
                downloadLink.download = `${student.nama}_QR.png`;

                // Paksa download dengan JS
                downloadLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    fetch(downloadLink.href)
                        .then(response => response.blob())
                        .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = `${student.nama}_QR.png`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                        });
                });

                downloadCell.appendChild(downloadLink);
            });
        } else {
            qrTableBody.innerHTML = isMobile
                ? '<tr><td colspan="3">Tidak ada data siswa</td></tr>'
                : '<tr><td colspan="4">Tidak ada data siswa</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        qrTableBody.innerHTML = '<tr><td colspan="4">Gagal memuat data siswa</td></tr>';
    }

    document.getElementById('hamburger').addEventListener('click', function () {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');

        // Toggle class 'hidden' pada sidebar
        sidebar.classList.toggle('hidden');

        // Toggle class 'collapsed' pada konten utama
        mainContent.classList.toggle('collapsed');
    });
});
