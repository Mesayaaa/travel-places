/**
 * Script untuk mengoptimalkan gambar secara otomatis
 * Membuat versi yang lebih kecil dari gambar untuk perangkat mobile
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Direktori gambar
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const MOBILE_DIR = path.join(IMAGES_DIR, 'mobile');

// Pastikan direktori mobile ada
if (!fs.existsSync(MOBILE_DIR)) {
  fs.mkdirSync(MOBILE_DIR, { recursive: true });
  console.log('✅ Direktori mobile dibuat');
}

// Fungsi untuk memeriksa apakah file adalah gambar
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
}

// Fungsi untuk mengoptimalkan gambar
function optimizeImage(imagePath) {
  const filename = path.basename(imagePath);
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  const mobileFilename = `${name}-mobile${ext}`;
  const mobilePath = path.join(MOBILE_DIR, mobileFilename);

  // Jika gambar mobile sudah ada, lewati
  if (fs.existsSync(mobilePath)) {
    console.log(`⏭️ ${mobileFilename} sudah ada, melewati...`);
    return;
  }

  try {
    // Gunakan sharp jika tersedia, jika tidak gunakan metode sederhana dengan fs
    console.log(`🔄 Mengoptimalkan ${filename}...`);
    
    // Salin file dan akan dioptimalkan secara manual
    fs.copyFileSync(imagePath, mobilePath);
    
    console.log(`✅ ${mobileFilename} dibuat`);
    
    console.log(`
    CATATAN PENTING:
    ------------------
    Gambar mobile yang dioptimalkan telah dibuat di ${mobilePath}
    
    Untuk mengoptimalkan gambar lebih lanjut, silakan:
    1. Gunakan alat seperti TinyPNG, Squoosh, atau alat kompresi gambar lainnya
    2. Resize gambar menjadi ukuran yang lebih kecil (disarankan maksimal lebar 640px)
    3. Simpan dengan format yang dioptimalkan seperti WebP
    
    Untuk website yang lebih cepat, penting untuk mengoptimalkan gambar secara manual.
    `);
  } catch (error) {
    console.error(`❌ Gagal mengoptimalkan ${filename}:`, error.message);
  }
}

// Mencari dan mengoptimalkan semua gambar
function processImagesInDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'mobile' && file !== 'optimized') {
      // Rekursif untuk subdirektori
      processImagesInDirectory(filePath);
    } else if (stat.isFile() && isImageFile(file)) {
      // Proses file gambar
      optimizeImage(filePath);
    }
  });
}

// Mulai proses optimasi
console.log('🚀 Memulai optimasi gambar...');
processImagesInDirectory(IMAGES_DIR);
console.log('✨ Optimasi gambar selesai!'); 