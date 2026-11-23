# Magangin – Portal Magang Mahasiswa IT
> **Tugas Perkuliahan Bab 9: NestJS Dasar + Struktur MVC**  
> Mata Kuliah: Pengembangan Perangkat Web (PPW)

---

## 1. Identitas Tugas & Judul Proyek

- **Nama Aplikasi**: Magangin – Portal Magang Mahasiswa IT
- **Topik Pembahasan**: Bab 9 – NestJS Dasar + Struktur MVC
- **Fokus Implementasi**: Pengembangan RESTful API Backend dengan NestJS (Arsitektur MVC), Dependency Injection, Validasi DTO, Global ValidationPipe, Exception Handling, serta Integrasi Frontend dengan Fetch API.

---

## 2. Deskripsi Aplikasi Magangin

**Magangin** adalah platform portal informasi lowongan kerja magang (*internship*) yang dirancang khusus untuk mahasiswa program studi Teknologi Informasi, Rekayasa Perangkat Lunak, dan Ilmu Komputer. Platform ini memudahkan mahasiswa menemukan peluang magang berdasarkan keahlian teknis (*tech stack*), lokasi kerja, model kerja (*Remote*, *Onsite*, *Hybrid*), hingga besaran uang saku yang ditawarkan.

Pada tahap pengembangan Bab 9 ini, aplikasi Magangin telah ditingkatkan dari yang sebelumnya bersifat statis menjadi aplikasi dinamis *full-stack*, di mana data lowongan dikelola langsung oleh backend NestJS dan disajikan ke frontend secara *real-time*.

---

## 3. Tujuan Pengembangan Backend

1. **Menerapkan Pola Arsitektur MVC (Model-View-Controller)** pada ekosistem NestJS.
2. **Menyediakan Layanan RESTful API** lengkap (Create, Read, Update, Delete) untuk entitas utama `lowongan`.
3. **Menerapkan Dependency Injection (DI)** untuk memisahkan tanggung jawab antara *controller* (penangan rute/request) dan *service* (logika bisnis).
4. **Mencegah Masuknya Data Tidak Valid** menggunakan *Data Transfer Object* (DTO) yang diperkuat dengan pustaka `class-validator` dan `class-transformer`.
5. **Mengimplementasikan Error Handling yang Standar** menggunakan HTTP Exception bawaan NestJS (`NotFoundException` dan `ConflictException`).
6. **Menghubungkan Backend dan Frontend** melalui REST API dan Fetch API JavaScript modern.

---

## 4. Teknologi yang Digunakan

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Node.js framework berbasis TypeScript)
- **Bahasa Pemrograman**: TypeScript (NodeNext / ES2023)
- **Penyimpanan Data**: In-Memory Array (penyimpanan sementara di memori RAM selama server aktif)
- **Validasi Input**: `class-validator` & `class-transformer`
- **Mapping DTO**: `@nestjs/mapped-types`
- **Testing API**: REST Client Extension (Visual Studio Code)

### Frontend
- **Markup & Layout**: Semantic HTML5 & CSS3
- **CSS Framework**: Bootstrap 5.3 & Bootswatch (Flatly theme)
- **Desain & Tipografi**: Google Fonts (*Space Grotesk* untuk aksen/heading, *Inter* untuk antarmuka teks)
- **Komunikasi Data**: JavaScript Fetch API (Async/Await)

---

## 5. Struktur Direktori Proyek

Proyek disusun dengan rapi memisahkan frontend, backend, dan dokumentasi:

```text
MAGANGIN/
│
├── frontend/
│   ├── assets/
│   │   ├── loker.js               # Logika CRUD, fetch API, filter, & modal UI
│   │   └── style.css              # Custom styling & token warna Magangin
│   ├── chat.html                  # Halaman chat perusahaan
│   ├── index.html                 # Dashboard utama mahasiswa
│   ├── loker.html                 # Halaman utama loker terintegrasi API
│   ├── profile.html               # Halaman portofolio & profil mahasiswa
│   └── universitas.html           # Halaman jejak alumni & mitra universitas
│
├── backend/
│   ├── src/
│   │   ├── lowongan/
│   │   │   ├── dto/
│   │   │   │   ├── create-lowongan.dto.ts   # Skema & aturan validasi create
│   │   │   │   └── update-lowongan.dto.ts   # Skema update (PartialType)
│   │   │   ├── entities/
│   │   │   │   └── lowongan.entity.ts       # Model data entitas Lowongan
│   │   │   ├── lowongan.controller.ts       # Penangan rute HTTP (Routing MVC)
│   │   │   ├── lowongan.module.ts           # Konfigurasi modul Lowongan
│   │   │   └── lowongan.service.ts          # Logika bisnis CRUD in-memory
│   │   ├── app.controller.ts
│   │   ├── app.module.ts                    # Root module aplikasi
│   │   ├── app.service.ts
│   │   └── main.ts                          # Bootstrap, Global Pipe, CORS
│   ├── test/
│   │   └── lowongan.http                    # File pengujian REST Client
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── api/
│   │   └── lowongan.http                    # Salinan pengujian REST Client
│   └── screenshots/                         # Folder bukti screenshot pengujian
│
├── .gitignore                               # Mengabaikan node_modules, dist, dll.
└── README.md                                # Dokumentasi lengkap tugas
```

---

## 6. Entity Lowongan & Penjelasan Field

Entitas utama dalam aplikasi ini adalah **`Lowongan`** yang didefinisikan pada file:  
`backend/src/lowongan/entities/lowongan.entity.ts`

Terdapat 9 field data dengan tipe data bervariasi:

| No | Nama Field | Tipe Data | Keterangan & Batasan |
|:---:|:---|:---|:---|
| 1 | `id` | `number` | Identitas unik otomatis (*primary key* in-memory). |
| 2 | `posisi` | `string` | Nama posisi magang (misal: "Quality Assurance Intern"). Minimal 3 karakter. |
| 3 | `perusahaan` | `string` | Nama perusahaan penyedia magang. Minimal 2 karakter. |
| 4 | `lokasi` | `string` | Kota lokasi penempatan atau keterangan kerja (misal: "Yogyakarta", "Bandung"). |
| 5 | `tipe` | `string` | Model kerja. Harus salah satu dari: `Remote`, `Onsite`, atau `Hybrid`. |
| 6 | `durasi` | `number` | Lama masa magang dalam satuan bulan (integer >= 1). |
| 7 | `gaji` | `number` | Uang saku per bulan dalam mata uang Rupiah (angka >= 0). |
| 8 | `deskripsi` | `string` | Uraian tugas dan tanggung jawab magang (minimal 10 karakter). |
| 9 | `skills` | `string[]` | Daftar keterampilan teknis yang dibutuhkan (berupa array string). |

> **Catatan Penyimpanan Data**: Backend menggunakan penyimpanan array *in-memory* di dalam `LowonganService`. Data awal diinisialisasi dengan 6 lowongan autentik bawaan Magangin. Karena tidak menggunakan database fisik/ORM, data akan kembali ke data awal jika server NestJS di-*restart*.

---

## 7. Penjelasan Struktur MVC pada NestJS

NestJS menerapkan pola arsitektur **Model-View-Controller (MVC)** yang terstruktur secara modular:

1. **Model (Entities & DTO)**:
   - Didefinisikan di `entities/lowongan.entity.ts` sebagai cetak biru struktur data.
   - Didefinisikan di `dto/create-lowongan.dto.ts` dan `dto/update-lowongan.dto.ts` sebagai kontrak data masukan.
2. **View (Frontend Web)**:
   - File antarmuka HTML/CSS/JavaScript di dalam folder `frontend/` (khususnya `frontend/loker.html` dan `frontend/assets/loker.js`) yang mengonsumsi data JSON dari backend dan merendernya dalam bentuk kartu interaktif Bootstrap.
3. **Controller (Routing & Handler)**:
   - Berada di `lowongan/lowongan.controller.ts`. Bertanggung jawab menerima request HTTP dari client, membaca URL parameter dan request body, lalu meneruskannya ke Service.
4. **Service (Business Logic)**:
   - Berada di `lowongan/lowongan.service.ts`. Berisi seluruh manipulasi data (penambahan ID otomatis, pengecekan duplikasi, pencarian data, pembaruan, dan penghapusan array).

---

## 8. Service & Dependency Injection (DI)

NestJS mengadopsi prinsip *Inversion of Control* (IoC) melalui **Dependency Injection (DI)**:

- Class `LowonganService` dianotasi dengan `@Injectable()`, menandakan bahwa class ini dapat didaftarkan sebagai provider pada container IoC NestJS.
- `LowonganController` menerima instance `LowonganService` melalui constructor injection:
  ```typescript
  @Controller('lowongan')
  export class LowonganController {
    constructor(private readonly lowonganService: LowonganService) {}
    ...
  }
  ```
- Controller **tidak pernah** membuat instance manual menggunakan keyword `new LowonganService()`, melainkan disuntikkan secara otomatis oleh NestJS Runtime. Hal ini menjaga kode tetap *loosely coupled*, rapi, dan mudah diuji.

---

## 9. DTO & ValidationPipe Global

Untuk menjaga integritas data yang masuk ke server, aplikasi menggunakan DTO (*Data Transfer Object*) dan *global validation pipe*.

### Aturan Validasi CreateLowonganDto:
- `@IsString()` & `@MinLength(3)` untuk `posisi`
- `@IsString()` & `@MinLength(2)` untuk `perusahaan`
- `@IsString()` & `@MinLength(2)` untuk `lokasi`
- `@IsIn(['Remote', 'Onsite', 'Hybrid'])` untuk `tipe`
- `@Type(() => Number)` & `@IsInt()` & `@Min(1)` untuk `durasi`
- `@Type(() => Number)` & `@IsNumber()` & `@Min(0)` untuk `gaji`
- `@IsString()` & `@MinLength(10)` untuk `deskripsi`
- `@IsArray()` & `@IsString({ each: true })` untuk `skills`

### Konfigurasi Global di `src/main.ts`:
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,            // Menghapus properti yang tidak terdaftar di DTO
    forbidNonWhitelisted: true, // Menolak request jika ada properti liar yang tidak dikenal
    transform: true,           // Mentransformasikan payload sesuai tipe data TypeScript
  }),
);
```

---

## 10. Error Handling & HTTP Exceptions

Aplikasi mengimplementasikan penanganan error menggunakan exception standar NestJS:

1. **`400 Bad Request`**: Dihasilkan otomatis oleh `ValidationPipe` saat payload JSON melanggar aturan DTO (misal: durasi bernilai 0, gaji minus, atau format tipe di luar enum).
2. **`404 Not Found` (`NotFoundException`)**:
   - Terjadi saat client meminta detail, mengubah, atau menghapus data lowongan dengan ID yang tidak terdaftar.
   - Contoh respons:
     ```json
     {
       "message": "Data lowongan dengan ID 999 tidak ditemukan.",
       "error": "Not Found",
       "statusCode": 404
     }
     ```
3. **`409 Conflict` (`ConflictException`)**:
   - Terjadi saat pengguna mencoba menambahkan lowongan baru yang memiliki kombinasi `posisi` dan `perusahaan` yang sudah ada di memori.
   - Contoh respons:
     ```json
     {
       "message": "Lowongan untuk posisi 'Quality Assurance Intern' di perusahaan 'NusaTech Solusi' sudah terdaftar.",
       "error": "Conflict",
       "statusCode": 409
     }
     ```

---

## 11. Daftar Endpoint REST API

| Method | Endpoint | Deskripsi | Status Code |
|:---:|:---|:---|:---:|
| `GET` | `/lowongan` | Mengambil seluruh daftar lowongan aktif | `200 OK` |
| `GET` | `/lowongan/:id` | Mengambil detail 1 lowongan berdasarkan ID | `200 OK` / `404 Not Found` |
| `POST` | `/lowongan` | Menambahkan lowongan internship baru | `201 Created` / `400 Bad Request` / `409 Conflict` |
| `PATCH`| `/lowongan/:id` | Memperbarui sebagian field lowongan berdasarkan ID | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE`| `/lowongan/:id`| Menghapus lowongan berdasarkan ID | `200 OK` / `404 Not Found` |

---

## 12. Contoh Request & Response

### A. GET Seluruh Lowongan
**Request**:
```http
GET http://localhost:3000/lowongan
Accept: application/json
```
**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "posisi": "Quality Assurance Intern",
    "perusahaan": "NusaTech Solusi",
    "lokasi": "Yogyakarta",
    "tipe": "Onsite",
    "durasi": 3,
    "gaji": 1400000,
    "deskripsi": "Melakukan pengujian fungsional aplikasi web dan menyusun laporan bug secara rutin.",
    "skills": ["Testing", "SQL", "Dokumentasi"]
  }
]
```

### B. POST Tambah Lowongan
**Request**:
```http
POST http://localhost:3000/lowongan
Content-Type: application/json

{
  "posisi": "Mobile Flutter Developer Intern",
  "perusahaan": "Sinergi Media Kreasi",
  "lokasi": "Bandung",
  "tipe": "Hybrid",
  "durasi": 6,
  "gaji": 1600000,
  "deskripsi": "Mengembangkan fitur mobile aplikasi menggunakan framework Flutter dan berkolaborasi dengan backend engineer.",
  "skills": ["Flutter", "Dart", "REST API", "Git"]
}
```
**Response (201 Created)**:
```json
{
  "id": 7,
  "posisi": "Mobile Flutter Developer Intern",
  "perusahaan": "Sinergi Media Kreasi",
  "lokasi": "Bandung",
  "tipe": "Hybrid",
  "durasi": 6,
  "gaji": 1600000,
  "deskripsi": "Mengembangkan fitur mobile aplikasi menggunakan framework Flutter dan berkolaborasi dengan backend engineer.",
  "skills": ["Flutter", "Dart", "REST API", "Git"]
}
```

---

## 13. Petunjuk Instalasi & Menjalankan Proyek

### Prasyarat
- Pastikan Node.js (versi 18 ke atas) dan npm sudah terpasang di komputer Anda.

### Menjalankan Backend NestJS:
1. Buka terminal dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Pasang dependensi jika belum terpasang:
   ```bash
   npm install
   ```
3. Bangun proyek untuk memastikan tidak ada kesalahan kompilasi:
   ```bash
   npm run build
   ```
4. Jalankan backend dalam mode development:
   ```bash
   npm run start:dev
   ```
5. Server backend akan aktif di: **`http://localhost:3000`**

### Menjalankan Frontend:
1. Anda dapat membuka folder `frontend` menggunakan ekstensi **Live Server** di VS Code:
   - Klik kanan pada `frontend/loker.html` -> pilih **Open with Live Server**.
2. Atau jalankan server statis menggunakan Python:
   ```bash
   # Di root project:
   python -m http.server 5500 --directory frontend
   ```
3. Akses antarmuka loker di browser: **`http://localhost:5500/loker.html`** (atau port yang diberikan Live Server).

---

## 14. Cara Menguji API Menggunakan REST Client

1. Pasang ekstensi **REST Client** oleh Huachao Mao di Visual Studio Code.
2. Buka file pengujian yang telah disiapkan di:
   - `backend/test/lowongan.http` atau `docs/api/lowongan.http`
3. Pastikan backend NestJS sedang berjalan di port 3000.
4. Klik tautan teks **`Send Request`** yang muncul di atas setiap blok request HTTP untuk menjalankan pengujian langsung.
5. Periksa status code dan data JSON yang muncul pada panel respon sebelah kanan.

---

## 15. Cara Melakukan CRUD dari Antarmuka Frontend

Buka halaman `frontend/loker.html` pada peramban web:

1. **Read (Melihat Lowongan)**:
   - Seluruh lowongan akan otomatis dimuat dari API backend saat halaman dibuka.
   - Gunakan kolom pencarian untuk menyaring berdasarkan posisi, perusahaan, atau keahlian.
   - Gunakan filter *dropdown* untuk memfilter jenis kerja (*Remote*, *Onsite*, *Hybrid*) atau mengurutkan berdasarkan gaji/durasi.
2. **Create (Menambah Lowongan)**:
   - Klik tombol hijau **`＋ Tambah Lowongan`** di bagian atas kanan.
   - Isi formulir modal dengan lengkap.
   - Klik **Simpan Lowongan**. Notifikasi *toast* sukses akan muncul dan daftar lowongan diperbarui otomatis.
3. **Update (Mengubah Lowongan)**:
   - Klik tombol **`Edit`** pada salah satu kartu lowongan.
   - Formulir modal edit akan terbuka dengan data yang sudah terisi sebelumnya.
   - Lakukan perubahan data yang diinginkan dan klik **Perbarui Lowongan**.
4. **Delete (Menghapus Lowongan)**:
   - Klik tombol merah **`Hapus`** pada kartu lowongan.
   - Modal konfirmasi akan menampilkan posisi dan perusahaan yang dipilih.
   - Klik **Ya, Hapus**. Data akan dihapus dari server dan kartu akan hilang dari layar.

---

## 16. Daftar Screenshot Bukti Pengerjaan (Dokumentasi)

Seluruh bukti pengujian dan tampilan antarmuka dapat disimpan di folder `docs/screenshots/` dengan nama file standar:

| No | Nama File | Deskripsi yang Ditampilkan |
|:---:|:---|:---|
| 1 | `01-project-structure.png` | Struktur folder proyek di VS Code Explorer (frontend, backend, docs). |
| 2 | `02-nestjs-running.png` | Terminal backend berhasil menjalankan `npm run start:dev` tanpa error. |
| 3 | `03-get-all-lowongan.png` | Respon `GET /lowongan` pada REST Client menampilkan array lowongan (200 OK). |
| 4 | `04-get-lowongan-by-id.png`| Respon `GET /lowongan/1` menampilkan detail lowongan ID 1 (200 OK). |
| 5 | `05-post-create-lowongan.png`| Respon `POST /lowongan` dengan data valid menghasilkan status 201 Created. |
| 6 | `06-patch-update-lowongan.png`| Respon `PATCH /lowongan/1` dengan payload pembaruan data (200 OK). |
| 7 | `07-delete-lowongan.png` | Respon `DELETE /lowongan/2` berhasil menghapus data (200 OK). |
| 8 | `08-validation-error.png` | Respon `POST /lowongan` data salah memicu HTTP 400 Bad Request & rincian error DTO. |
| 9 | `09-not-found-error.png` | Respon `GET /lowongan/999` memicu HTTP 404 NotFoundException. |
| 10| `10-conflict-error.png` | Respon `POST /lowongan` data duplikat memicu HTTP 409 ConflictException. |
| 11| `11-frontend-list-lowongan.png`| Tampilan browser `loker.html` menampilkan daftar kartu lowongan dari backend. |
| 12| `12-frontend-create-lowongan.png`| Tampilan modal tambah lowongan saat diisi atau setelah submit sukses. |
| 13| `13-frontend-update-lowongan.png`| Tampilan modal edit lowongan dengan data terisi. |
| 14| `14-frontend-delete-lowongan.png`| Tampilan modal konfirmasi hapus lowongan. |

### Panduan Mengambil Screenshot Manual:
1. **Untuk Screenshot API (03 s.d. 10)**: Buka file `backend/test/lowongan.http` di VS Code, klik *Send Request*, lalu ambil tangkapan layar panel request dan response yang berdampingan menggunakan tombol `Win + Shift + S`.
2. **Untuk Screenshot Frontend (11 s.d. 14)**: Buka `http://localhost:5500/loker.html` (atau via Live Server) di browser, lakukan interaksi (buka modal tambah, edit, hapus), lalu ambil screenshot peramban dan simpan ke folder `docs/screenshots/`.
