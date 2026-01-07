import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables dari .env.local
dotenv.config({ path: ".env.local" });

// Baris ini buat nge-cek di terminal nanti apakah alamatnya kebaca atau "undefined"
console.log("Cek Koneksi Database:", process.env.DATABASE_URL ? "DITEMUKAN ✅" : "TIDAK DITEMUKAN ❌");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});