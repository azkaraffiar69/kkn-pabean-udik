"use server"

import { db } from "@/db";
import { members, kegiatan, gallery } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

// --- MEMBER ACTIONS ---
// Fungsi ini yang tadinya hilang, menyebabkan data tidak muncul di list admin
export async function getMembers() {
  return await db.select().from(members);
}

export async function createMember(name: string, role: string, major: string, imageUrl: string) {
  try {
    await db.insert(members).values({ name, role, major, imageUrl });
    revalidatePath("/"); // Membersihkan cache halaman utama
    revalidatePath("/admin"); // Membersihkan cache halaman admin
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function updateMember(id: number, name: string, role: string, major: string) {
  await db.update(members).set({ name, role, major }).where(eq(members.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteMember(id: number) {
  await db.delete(members).where(eq(members.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

// --- KEGIATAN ACTIONS ---
export async function getKegiatan() {
  return await db.select().from(kegiatan).orderBy(desc(kegiatan.createdAt));
}

export async function createKegiatan(title: string, description: string, imageUrl: string) {
  try {
    await db.insert(kegiatan).values({ title, description, imageUrl });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function updateKegiatan(id: number, title: string, description: string) {
  await db.update(kegiatan).set({ title, description }).where(eq(kegiatan.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

// --- GALLERY ACTIONS ---
export async function getGallery() {
  return await db.select().from(gallery).orderBy(desc(gallery.createdAt));
}

export async function createGallery(imageUrl: string, caption: string) {
  try {
    await db.insert(gallery).values({ imageUrl, caption });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function updateGallery(id: number, caption: string) {
  await db.update(gallery).set({ caption }).where(eq(gallery.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}