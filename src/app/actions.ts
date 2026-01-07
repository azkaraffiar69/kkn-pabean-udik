"use server"

import { db } from "@/db";
import { members, kegiatan, gallery } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/* =============================================================
   SECTION 1: FUNGSI READ (Ambil Data)
   ============================================================= */

export async function getMembers() {
  try {
    return await db.select().from(members);
  } catch (error) {
    return [];
  }
}

export async function getKegiatan() {
  try {
    return await db.select().from(kegiatan).orderBy(desc(kegiatan.createdAt));
  } catch (error) {
    return [];
  }
}

// Pastikan namanya getGallery agar error "Export doesn't exist" hilang
export async function getGallery() {
  try {
    return await db.select().from(gallery).orderBy(desc(gallery.createdAt));
  } catch (error) {
    return [];
  }
}

/* =============================================================
   SECTION 2: FUNGSI WRITE & DELETE (Kelola Data)
   ============================================================= */

// --- MEMBER ---
export async function createMember(name: string, role: string, major: string, imageUrl: string) {
  await db.insert(members).values({ name, role, major, imageUrl });
  revalidatePath("/");
  revalidatePath("/admin");
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

// --- KEGIATAN ---
export async function createKegiatan(title: string, description: string, imageUrl: string) {
  await db.insert(kegiatan).values({ title, description, imageUrl });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateKegiatan(id: number, title: string, description: string) {
  await db.update(kegiatan).set({ title, description }).where(eq(kegiatan.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteKegiatan(id: number) {
  await db.delete(kegiatan).where(eq(kegiatan.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

// --- GALLERY ---
export async function createGallery(imageUrl: string, caption: string) {
  await db.insert(gallery).values({ imageUrl, caption });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateGallery(id: number, caption: string) {
  await db.update(gallery).set({ caption }).where(eq(gallery.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteGallery(id: number) {
  await db.delete(gallery).where(eq(gallery.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}