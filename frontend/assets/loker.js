const API_BASE_URL = 'http://localhost:3000/lowongan';

let allLowongan = [];
let deleteTargetId = null;

const logoClassMap = {
  'nusatech solusi': 'c-nusatech',
  'cakrawala cloud': 'c-cakrawala',
  'vaktura digital': 'c-vaktura',
  'lokadata analytics': 'c-lokadata',
  'swadesi commerce': 'c-swadesi',
};

function getLogoClass(perusahaan) {
  const key = perusahaan.trim().toLowerCase();
  return logoClassMap[key] || '';
}

function getCompanyInitials(perusahaan) {
  if (!perusahaan) return 'MG';
  const words = perusahaan.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return perusahaan.substring(0, 2).toUpperCase();
}

function formatRupiah(amount) {
  return 'Rp' + Number(amount).toLocaleString('id-ID') + '/bulan';
}

function showToast(message, isSuccess = true) {
  const toastEl = document.getElementById('appToast');
  const toastMessage = document.getElementById('toastMessage');
  toastMessage.textContent = message;

  toastEl.classList.remove('bg-success', 'bg-danger');
  toastEl.classList.add(isSuccess ? 'bg-success' : 'bg-danger');

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3500 });
  toast.show();
}

async function fetchLowongan() {
  const container = document.getElementById('lowonganContainer');
  const countEl = document.getElementById('lowonganCount');

  container.innerHTML = `
    <div class="card border-0 shadow-sm p-5 text-center my-4">
      <div class="spinner-border text-success mx-auto mb-3" role="status"></div>
      <div class="text-body-secondary">Memuat data lowongan dari server...</div>
    </div>
  `;
  countEl.textContent = 'Memuat...';

  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) {
      throw new Error(`Server merespons dengan status ${res.status}`);
    }
    allLowongan = await res.json();
    applyFilterAndRender();
  } catch (error) {
    container.innerHTML = `
      <div class="card border-0 shadow-sm p-5 text-center my-4">
        <div class="text-danger fs-1 mb-2">⚠️</div>
        <h3 class="h5 fw-bold text-dark">Gagal Terhubung ke Backend</h3>
        <p class="text-body-secondary small mb-3">
          Pastikan backend NestJS sudah dijalankan di <code>http://localhost:3000</code>.<br>
          Detail error: ${error.message}
        </p>
        <div>
          <button type="button" class="btn btn-outline-primary btn-sm px-3" onclick="fetchLowongan()">
            Coba Lagi
          </button>
        </div>
      </div>
    `;
    countEl.textContent = 'Gagal memuat lowongan';
  }
}

function applyFilterAndRender() {
  const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const selectedTipe = document.getElementById('tipeFilter')?.value || '';
  const selectedSort = document.getElementById('sortFilter')?.value || 'terbaru';

  let filtered = allLowongan.filter((item) => {
    const matchSearch =
      !searchTerm ||
      item.posisi.toLowerCase().includes(searchTerm) ||
      item.perusahaan.toLowerCase().includes(searchTerm) ||
      item.lokasi.toLowerCase().includes(searchTerm) ||
      (Array.isArray(item.skills) && item.skills.some((s) => s.toLowerCase().includes(searchTerm)));

    const matchTipe = !selectedTipe || item.tipe === selectedTipe;

    return matchSearch && matchTipe;
  });

  if (selectedSort === 'gaji-desc') {
    filtered.sort((a, b) => b.gaji - a.gaji);
  } else if (selectedSort === 'durasi-asc') {
    filtered.sort((a, b) => a.durasi - b.durasi);
  } else {
    filtered.sort((a, b) => b.id - a.id);
  }

  const countEl = document.getElementById('lowonganCount');
  countEl.textContent = `${filtered.length} lowongan ditemukan`;

  renderList(filtered);
}

function renderList(items) {
  const container = document.getElementById('lowonganContainer');

  if (items.length === 0) {
    container.innerHTML = `
      <div class="card border-0 shadow-sm p-5 text-center my-4">
        <div class="text-body-secondary fs-1 mb-2">🔍</div>
        <h3 class="h6 fw-bold">Tidak ada lowongan yang sesuai</h3>
        <p class="small text-body-secondary mb-3">Coba ubah kata kunci pencarian atau filter yang dipilih.</p>
        <div>
          <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#modalTambah">
            ＋ Tambah Lowongan Baru
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const logoClass = getLogoClass(item.perusahaan);
      const initials = getCompanyInitials(item.perusahaan);
      const skillsHtml = Array.isArray(item.skills)
        ? item.skills.map((s) => `<span class="badge rounded-pill text-bg-success">${s}</span>`).join(' ')
        : '';

      return `
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body">
            <div class="row g-3 align-items-start">
              <div class="col-auto">
                <span class="badge logo ${logoClass} fs-5 p-3">${initials}</span>
              </div>
              <div class="col">
                <h3 class="h6 fw-bold mb-0">${escapeHtml(item.posisi)}</h3>
                <div class="text-body-secondary small">${escapeHtml(item.perusahaan)} &middot; ${escapeHtml(item.lokasi)}</div>
                <p class="small text-body-secondary mt-2 mb-0">${escapeHtml(item.deskripsi)}</p>
                <div class="d-flex flex-wrap gap-1 mt-2">
                  <span class="badge rounded-pill text-bg-primary">${escapeHtml(item.tipe)}</span>
                  <span class="badge rounded-pill text-bg-light border">${item.durasi} bulan</span>
                  <span class="badge rounded-pill text-bg-warning">${formatRupiah(item.gaji)}</span>
                  ${skillsHtml}
                </div>
              </div>
              <div class="col-12 col-md-auto text-md-end">
                <div class="d-flex gap-2 mt-2 justify-content-md-end">
                  <button type="button" class="btn btn-outline-primary btn-sm" onclick="openEditModal(${item.id})">Edit</button>
                  <button type="button" class="btn btn-outline-danger btn-sm" onclick="openDeleteModal(${item.id})">Hapus</button>
                  <button type="button" class="btn btn-success btn-sm">Lamar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.getElementById('formTambah')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const alertEl = document.getElementById('tambahErrorAlert');
  alertEl.classList.add('d-none');
  alertEl.textContent = '';

  const skillsRaw = document.getElementById('tambahSkills').value;
  const skillsArray = skillsRaw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const payload = {
    posisi: document.getElementById('tambahPosisi').value.trim(),
    perusahaan: document.getElementById('tambahPerusahaan').value.trim(),
    lokasi: document.getElementById('tambahLokasi').value.trim(),
    tipe: document.getElementById('tambahTipe').value,
    durasi: parseInt(document.getElementById('tambahDurasi').value, 10),
    gaji: parseFloat(document.getElementById('tambahGaji').value),
    deskripsi: document.getElementById('tambahDeskripsi').value.trim(),
    skills: skillsArray,
  };

  const btnSimpan = document.getElementById('btnSimpanTambah');
  btnSimpan.disabled = true;
  btnSimpan.textContent = 'Menyimpan...';

  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Gagal menyimpan lowongan.';
      alertEl.textContent = errorMsg;
      alertEl.classList.remove('d-none');
      return;
    }

    const modalEl = document.getElementById('modalTambah');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    document.getElementById('formTambah').reset();
    showToast('Lowongan berhasil ditambahkan!');
    await fetchLowongan();
  } catch (err) {
    alertEl.textContent = 'Terjadi kesalahan jaringan: ' + err.message;
    alertEl.classList.remove('d-none');
  } finally {
    btnSimpan.disabled = false;
    btnSimpan.textContent = 'Simpan Lowongan';
  }
});

function openEditModal(id) {
  const item = allLowongan.find((l) => l.id === id);
  if (!item) return;

  const alertEl = document.getElementById('editErrorAlert');
  alertEl.classList.add('d-none');
  alertEl.textContent = '';

  document.getElementById('editId').value = item.id;
  document.getElementById('editPosisi').value = item.posisi;
  document.getElementById('editPerusahaan').value = item.perusahaan;
  document.getElementById('editLokasi').value = item.lokasi;
  document.getElementById('editTipe').value = item.tipe;
  document.getElementById('editDurasi').value = item.durasi;
  document.getElementById('editGaji').value = item.gaji;
  document.getElementById('editDeskripsi').value = item.deskripsi;
  document.getElementById('editSkills').value = Array.isArray(item.skills) ? item.skills.join(', ') : '';

  const modalEl = document.getElementById('modalEdit');
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

document.getElementById('formEdit')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const alertEl = document.getElementById('editErrorAlert');
  alertEl.classList.add('d-none');
  alertEl.textContent = '';

  const id = document.getElementById('editId').value;
  const skillsRaw = document.getElementById('editSkills').value;
  const skillsArray = skillsRaw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const payload = {
    posisi: document.getElementById('editPosisi').value.trim(),
    perusahaan: document.getElementById('editPerusahaan').value.trim(),
    lokasi: document.getElementById('editLokasi').value.trim(),
    tipe: document.getElementById('editTipe').value,
    durasi: parseInt(document.getElementById('editDurasi').value, 10),
    gaji: parseFloat(document.getElementById('editGaji').value),
    deskripsi: document.getElementById('editDeskripsi').value.trim(),
    skills: skillsArray,
  };

  const btnSimpan = document.getElementById('btnSimpanEdit');
  btnSimpan.disabled = true;
  btnSimpan.textContent = 'Memperbarui...';

  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Gagal memperbarui lowongan.';
      alertEl.textContent = errorMsg;
      alertEl.classList.remove('d-none');
      return;
    }

    const modalEl = document.getElementById('modalEdit');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    showToast('Lowongan berhasil diperbarui!');
    await fetchLowongan();
  } catch (err) {
    alertEl.textContent = 'Terjadi kesalahan jaringan: ' + err.message;
    alertEl.classList.remove('d-none');
  } finally {
    btnSimpan.disabled = false;
    btnSimpan.textContent = 'Perbarui Lowongan';
  }
});

function openDeleteModal(id) {
  const item = allLowongan.find((l) => l.id === id);
  if (!item) return;

  deleteTargetId = id;
  document.getElementById('hapusPosisi').textContent = item.posisi;
  document.getElementById('hapusPerusahaan').textContent = `${item.perusahaan} · ${item.lokasi}`;

  const modalEl = document.getElementById('modalHapus');
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

document.getElementById('btnKonfirmasiHapus')?.addEventListener('click', async function () {
  if (!deleteTargetId) return;

  const btn = this;
  btn.disabled = true;
  btn.textContent = 'Menghapus...';

  try {
    const res = await fetch(`${API_BASE_URL}/${deleteTargetId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Gagal menghapus lowongan.');
    }

    const modalEl = document.getElementById('modalHapus');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    showToast('Lowongan berhasil dihapus!');
    deleteTargetId = null;
    await fetchLowongan();
  } catch (err) {
    alert('Gagal menghapus: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Ya, Hapus';
  }
});

document.getElementById('searchInput')?.addEventListener('input', applyFilterAndRender);
document.getElementById('tipeFilter')?.addEventListener('change', applyFilterAndRender);
document.getElementById('sortFilter')?.addEventListener('change', applyFilterAndRender);

document.addEventListener('DOMContentLoaded', fetchLowongan);
