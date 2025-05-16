document.addEventListener('DOMContentLoaded', async function () {
    const userNameElement = document.querySelector('header h1');
    const studentTableBody = document.querySelector('.content .card table tbody');

    try {
        // Ambil data pengguna dari API
        const userResponse = await fetch('https://faqih.pythonanywhere.com/api/user', {
            credentials: 'include'  // Pastikan cookie dikirim
        });
        if (!userResponse.ok) {
            throw new Error('Gagal mengambil data pengguna');
        }

        const userData = await userResponse.json();

        // Tampilkan nama pengguna di header
        if (userNameElement) {
            userNameElement.textContent = `Selamat Datang, ${userData.username}! (Kelas: ${userData.kelas})`;
        }

        // Ambil data siswa dari API berdasarkan kelas
        const siswaResponse = await fetch(`https://faqih.pythonanywhere.com/api/siswa?kelas=${userData.kelas}`, {
            credentials: 'include'  // Pastikan cookie dikirim
        });
        if (!siswaResponse.ok) {
            throw new Error('Gagal mengambil data siswa');
        }

        const studentsData = await siswaResponse.json();

        // Tampilkan data siswa di tabel
        if (studentTableBody && studentsData.length > 0) {
            studentsData.forEach((student, index) => {
                const row = studentTableBody.insertRow();
                const noCell = row.insertCell();
                const nameCell = row.insertCell();
                const nisnCell = row.insertCell();

                // Nomor
                noCell.textContent = index + 1;

                // Nama Siswa
                nameCell.textContent = student.nama;

                // NISN
                nisnCell.textContent = student.nisn;
            });
        } else {
            studentTableBody.innerHTML = '<tr><td colspan="3">Tidak ada data siswa</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        if (userNameElement) {
            userNameElement.textContent = 'Selamat Datang, Pengguna!';
        }
        if (studentTableBody) {
            studentTableBody.innerHTML = '<tr><td colspan="3">Gagal memuat data siswa</td></tr>';
        }
    }
});

document.getElementById('hamburger').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const hamburger = document.getElementById('hamburger');

    // Toggle class 'hidden' pada sidebar
    sidebar.classList.toggle('hidden');

    // Toggle class 'collapsed' pada main content
    mainContent.classList.toggle('collapsed');

    // Toggle class 'open' pada tombol hamburger
    hamburger.classList.toggle('open');
});

// document.addEventListener('DOMContentLoaded', function () {
//     const hamburger = document.getElementById('hamburger');
//     if (hamburger) {
//         hamburger.addEventListener('click', function () {
//             const sidebar = document.getElementById('sidebar');
//             const mainContent = document.querySelector('.main-content');

//             // Toggle class 'hidden' pada sidebar
//             sidebar.classList.toggle('hidden');

//             // Toggle class 'collapsed' pada main content
//             mainContent.classList.toggle('collapsed');
//         });
//     } else {
//         console.error('Elemen hamburger tidak ditemukan.');
//     }
// });
