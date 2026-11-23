import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateLowonganDto } from './dto/create-lowongan.dto.js';
import { UpdateLowonganDto } from './dto/update-lowongan.dto.js';
import { Lowongan } from './entities/lowongan.entity.js';

@Injectable()
export class LowonganService {
  private lowonganList: Lowongan[] = [
    {
      id: 1,
      posisi: 'Quality Assurance Intern',
      perusahaan: 'NusaTech Solusi',
      lokasi: 'Yogyakarta',
      tipe: 'Onsite',
      durasi: 3,
      gaji: 1400000,
      deskripsi: 'Melakukan pengujian fungsional aplikasi web dan menyusun laporan bug secara rutin.',
      skills: ['Testing', 'SQL', 'Dokumentasi'],
    },
    {
      id: 2,
      posisi: 'Cloud & DevOps Intern',
      perusahaan: 'Cakrawala Cloud',
      lokasi: 'Surabaya',
      tipe: 'Hybrid',
      durasi: 3,
      gaji: 1700000,
      deskripsi: 'Membantu tim infrastruktur mengelola pipeline deployment dan monitoring server klien.',
      skills: ['Docker', 'Linux', 'CI/CD'],
    },
    {
      id: 3,
      posisi: 'Back-End Developer Intern',
      perusahaan: 'Vaktura Digital',
      lokasi: 'Jakarta (Remote)',
      tipe: 'Remote',
      durasi: 4,
      gaji: 2000000,
      deskripsi: 'Mengembangkan dan menguji REST API untuk layanan pembayaran digital yang digunakan ribuan UMKM.',
      skills: ['Node.js', 'SQL', 'REST API'],
    },
    {
      id: 4,
      posisi: 'Front-End Developer Intern',
      perusahaan: 'NusaTech Solusi',
      lokasi: 'Yogyakarta',
      tipe: 'Hybrid',
      durasi: 3,
      gaji: 1500000,
      deskripsi: 'Membantu tim front-end membangun dan memelihara dashboard internal untuk klien pemerintah daerah.',
      skills: ['React', 'JavaScript', 'CSS'],
    },
    {
      id: 5,
      posisi: 'Data Analyst Intern',
      perusahaan: 'Lokadata Analytics',
      lokasi: 'Bandung',
      tipe: 'Onsite',
      durasi: 6,
      gaji: 1800000,
      deskripsi: 'Mengolah dan memvisualisasikan data penjualan klien ritel untuk mendukung pengambilan keputusan bisnis.',
      skills: ['Python', 'SQL', 'Data Visualization'],
    },
    {
      id: 6,
      posisi: 'UI/UX Design Intern',
      perusahaan: 'Swadesi Commerce',
      lokasi: 'Jakarta (Remote)',
      tipe: 'Remote',
      durasi: 3,
      gaji: 1200000,
      deskripsi: 'Merancang tampilan fitur baru aplikasi e-commerce bersama tim produk dan riset pengguna.',
      skills: ['Figma', 'UI/UX', 'Riset Pengguna'],
    },
  ];

  create(createLowonganDto: CreateLowonganDto): Lowongan {
    const isDuplicate = this.lowonganList.some(
      (item) =>
        item.posisi.trim().toLowerCase() === createLowonganDto.posisi.trim().toLowerCase() &&
        item.perusahaan.trim().toLowerCase() === createLowonganDto.perusahaan.trim().toLowerCase(),
    );

    if (isDuplicate) {
      throw new ConflictException(
        `Lowongan untuk posisi '${createLowonganDto.posisi}' di perusahaan '${createLowonganDto.perusahaan}' sudah terdaftar.`,
      );
    }

    const nextId =
      this.lowonganList.length > 0
        ? Math.max(...this.lowonganList.map((item) => item.id)) + 1
        : 1;

    const newLowongan: Lowongan = {
      id: nextId,
      ...createLowonganDto,
    };

    this.lowonganList.push(newLowongan);
    return newLowongan;
  }

  findAll(): Lowongan[] {
    return this.lowonganList;
  }

  findOne(id: number): Lowongan {
    const lowongan = this.lowonganList.find((item) => item.id === id);
    if (!lowongan) {
      throw new NotFoundException(`Data lowongan dengan ID ${id} tidak ditemukan.`);
    }
    return lowongan;
  }

  update(id: number, updateLowonganDto: UpdateLowonganDto): Lowongan {
    const existing = this.findOne(id);

    const targetPosisi = updateLowonganDto.posisi ?? existing.posisi;
    const targetPerusahaan = updateLowonganDto.perusahaan ?? existing.perusahaan;

    const isDuplicate = this.lowonganList.some(
      (item) =>
        item.id !== id &&
        item.posisi.trim().toLowerCase() === targetPosisi.trim().toLowerCase() &&
        item.perusahaan.trim().toLowerCase() === targetPerusahaan.trim().toLowerCase(),
    );

    if (isDuplicate) {
      throw new ConflictException(
        `Lowongan untuk posisi '${targetPosisi}' di perusahaan '${targetPerusahaan}' sudah terdaftar.`,
      );
    }

    const index = this.lowonganList.findIndex((item) => item.id === id);
    const updated: Lowongan = {
      ...existing,
      ...updateLowonganDto,
    };

    this.lowonganList[index] = updated;
    return updated;
  }

  remove(id: number): { message: string; data: Lowongan } {
    const existing = this.findOne(id);
    this.lowonganList = this.lowonganList.filter((item) => item.id !== id);
    return {
      message: `Lowongan dengan ID ${id} berhasil dihapus.`,
      data: existing,
    };
  }
}
