"use server"

import { db } from "@/db";
import { members, kegiatan, gallery, kknConfig } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/* =============================================================
   SECTION 1: FUNGSI AMBIL DATA (READ)
   ============================================================= */

export async function getMembers() {
  try {
    return await db.select().from(members);
  } catch (error) {
    console.error("Gagal mengambil data member:", error);
    return [];
  }
}

export async function getKegiatan() {
  try {
    return await db.select().from(kegiatan).orderBy(desc(kegiatan.createdAt));
  } catch (error) {
    console.error("Gagal mengambil data kegiatan:", error);
    return [];
  }
}

export async function getGallery() {
  try {
    return await db.select().from(gallery).orderBy(desc(gallery.createdAt));
  } catch (error) {
    console.error("Gagal mengambil data galeri:", error);
    return [];
  }
}

export async function getConfig() {
  try {
    const data = await db.select().from(kknConfig).limit(1);
    return data[0] || null;
  } catch (error) {
    console.error("Gagal mengambil config:", error);
    return null;
  }
}

/* =============================================================
   SECTION 2: FUNGSI KELOLA DATA (CRUD)
   ============================================================= */

// --- MEMBER ---
export async function createMember(name: string, role: string, major: string, imageUrl: string) {
  try {
    await db.insert(members).values({ name, role, major, imageUrl });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) { return { success: false }; }
}

export async function updateMember(id: number, name: string, role: string, major: string) {
  try {
    await db.update(members).set({ name, role, major }).where(eq(members.id, id));
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) { return { success: false }; }
}

export async function deleteMember(id: number) {
  try {
    await db.delete(members).where(eq(members.id, id));
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) { return { success: false }; }
}

// --- KEGIATAN ---
export async function createKegiatan(title: string, description: string, imageUrl: string) {
  try {
    await db.insert(kegiatan).values({ title, description, imageUrl });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) { return { success: false }; }
}

export async function updateKegiatan(id: number, title: string, description: string) {
  try {
    await db.update(kegiatan).set({ title, description }).where(eq(kegiatan.id, id));
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) { return { success: false }; }
}

// Tambahan: Update Progres Per Proker
export async function updateProkerProgress(id: number, progress: number) {
  try {
    await db.update(kegiatan)
      .set({ progress })
      .where(eq(kegiatan.id, id));
    
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteKegiatan(id: number) {
  try {
    await db.delete(kegiatan).where(eq(kegiatan.id, id));
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) { return { success: false }; }
}

// --- GALLERY ---
export async function createGallery(imageUrl: string, title: string, caption: string) {
  try {
    await db.insert(gallery).values({ imageUrl, title, caption });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) { 
    console.error("Error creating gallery:", e);
    return { success: false }; 
  }
}

export async function updateGallery(id: number, title: string, caption: string) {
  try {
    await db.update(gallery).set({ title, caption }).where(eq(gallery.id, id));
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) { 
    console.error("Error updating gallery:", e);
    return { success: false }; 
  }
}

export async function deleteGallery(id: number) {
  try {
    await db.delete(gallery).where(eq(gallery.id, id));
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) { 
    console.error("Error deleting gallery:", e);
    return { success: false }; 
  }
}

/* =============================================================
   SECTION 3: CONFIG & SETTINGS
   ============================================================= */

// Tambahan: Fungsi untuk update Countdown dan Progres Global
export async function updateConfig(formData: FormData) {
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);
  const totalProgress = parseInt(formData.get("totalProgress") as string);

  try {
    await db.update(kknConfig)
      .set({ startDate, endDate, totalProgress })
      .where(eq(kknConfig.id, 1));
    
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Gagal update database" };
  }
}

/* =============================================================
   SECTION 4: AUTHENTICATION
   ============================================================= */

export async function login(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD; 

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD tidak ditemukan di lingkungan server.");
    return { success: false, message: "Server configuration error." };
  }

  if (password === adminPassword) {
    return { success: true };
  } else {
    return { success: false, message: "Password salah!" };
  }
}