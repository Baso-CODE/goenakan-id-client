import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const inputFile = path.join(root, "data/legacy-redirects.tsv");
const outputFile = path.join(root, "data/legacy-redirects.json");

const content = fs.readFileSync(inputFile, "utf8");

const lines = content
  .replace(/^\uFEFF/, "")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const redirects = {};

function normalizePath(value) {
  const input = value.trim();

  if (!input) throw new Error("Path kosong.");

  let pathname = input;

  if (/^https?:\/\//i.test(input)) {
    const url = new URL(input);

    if (!["goenakan.id", "www.goenakan.id"].includes(url.hostname)) {
      throw new Error(`Domain tidak diizinkan: ${input}`);
    }

    if (url.search || url.hash) {
      throw new Error(`Query/hash belum didukung: ${input}`);
    }

    pathname = url.pathname;
  }

  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  return pathname.replace(/\/+/g, "/").replace(/\/+$/, "") || "/";
}

for (const [index, line] of lines.entries()) {
  if (index === 0 && line.toLowerCase().startsWith("oldpath\t")) {
    continue;
  }

  const columns = line.split("\t");

  if (columns.length !== 2) {
    throw new Error(`Baris ${index + 1}: harus memiliki dua kolom.`);
  }

  const oldPath = normalizePath(columns[0]);
  const newPath = normalizePath(columns[1]);

  if (!/^\/(?:id|en)\/(?:article|products)\/[^/?#]+$/.test(newPath)) {
    throw new Error(`Baris ${index + 1}: tujuan tidak valid: ${newPath}`);
  }

  if (oldPath === newPath) {
    throw new Error(`Baris ${index + 1}: redirect ke dirinya sendiri.`);
  }

  if (redirects[oldPath] && redirects[oldPath] !== newPath) {
    throw new Error(`Baris ${index + 1}: mapping duplikat: ${oldPath}`);
  }

  redirects[oldPath] = newPath;
}

fs.writeFileSync(outputFile, `${JSON.stringify(redirects, null, 2)}\n`);

console.log(`✅ Berhasil generate ${Object.keys(redirects).length} redirect.`);
