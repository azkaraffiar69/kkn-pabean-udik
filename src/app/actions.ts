"use server"

import { db } from "@/db";
import { members, kegiatan, gallery } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/* =============================================================
   SECTION 1: FUNGSI READ (Ambil Data)
   ============================================================= */

/**
 * Mengambil semua data anggota tim KKN
 */
export async function getMembers() {
  try {
    return await db.select().from(members);
  } catch (error) {
    console.error("Gagal mengambil data member:", error);
    return [];
  }
}

/**
 * Mengambil data program kerja/kegiatan berdasarkan tanggal terbaru
 */
export async function getKegiatan() {
  try {
    return await db.select().from(kegiatan).orderBy(desc(kegiatan.createdAt));
  } catch (error) {
    console.error("Gagal mengambil data kegiatan:", error);
    return [];
  }
}

/**
 * Mengambil data foto galeri berdasarkan tanggal terbaru
 */
export async function getGallery() {
  try {
    return await db.select().from(gallery).orderBy(desc(gallery.createdAt));
  } catch (error) {
    console.error("Gagal mengambil data galeri:", error);
    return [];
  }
}

/* =============================================================
   SECTION 2: FUNGSI WRITE & DELETE (Kelola Data)
   ============================================================= */

// --- FUNGSI KELOLA MEMBER ---
export async function createMember(name: string, role: string, major: string, imageUrl: string) {
  await db.insert(members).values({ name, role, major, imageUrl });
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateMember(id: number, name: string, role: string, major: string) {
  await db.update(members).set({ name, role, major }).where(eq(members.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteMember(id: number) {
  await db.delete(members).where(eq(members.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// --- FUNGSI KELOLA KEGIATAN ---
export async function createKegiatan(title: string, description: string, imageUrl: string) {
  await db.insert(kegiatan).values({ title, description, imageUrl });
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateKegiatan(id: number, title: string, description: string) {
  await db.update(kegiatan).set({ title, description }).where(eq(kegiatan.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteKegiatan(id: number) {
  await db.delete(kegiatan).where(eq(kegiatan.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// --- FUNGSI KELOLA GALLERY ---
export async function createGallery(imageUrl: string, caption: string) {
  await db.insert(gallery).values({ imageUrl, caption });
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateGallery(id: number, caption: string) {
  await db.update(gallery).set({ caption }).where(eq(gallery.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteGallery(id: number) {
  await db.delete(gallery).where(eq(gallery.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

/* =============================================================
   SECTION 3: AUTHENTICATION
   ============================================================= */

/**
 * Validasi login admin menggunakan Environment Variable
 */
export async function login(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD; 

  // Keamanan tambahan: Cek jika env belum diatur
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD tidak ditemukan di Environment Variables");
    return { success: false, message: "Kesalahan konfigurasi server." };
  }

  if (password === adminPassword) {
    return { success: true };
  } else {
    return { success: false, message: "Password salah!" };
  }
}