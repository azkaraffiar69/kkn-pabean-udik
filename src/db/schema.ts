import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  major: text("major").notNull(), // Pastikan ini ada
  imageUrl: text("image_url"),
});

export const kegiatan = pgTable("kegiatan", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),     // Kolom baru untuk Judul
  caption: text("caption"),           // Kolom untuk Deskripsi/Caption
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});