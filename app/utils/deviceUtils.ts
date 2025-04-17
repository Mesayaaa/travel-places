/**
 * Utilitas untuk mendeteksi kemampuan perangkat dan mengoptimalkan performa
 */

/**
 * Mengecek apakah perangkat adalah perangkat low-end
 * Pengecekan berdasarkan memori perangkat, jumlah core CPU, dan data connection
 * 
 * @returns {boolean} True jika perangkat terdeteksi low-end
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Deteksi berdasarkan memori (jika tersedia)
  if ('deviceMemory' in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory && memory <= 2) {
      return true;
    }
  }
  
  // Deteksi berdasarkan CPU (jika tersedia)
  if ('hardwareConcurrency' in navigator) {
    const cpuCores = navigator.hardwareConcurrency;
    if (cpuCores && cpuCores <= 4) {
      return true;
    }
  }
  
  // Deteksi berdasarkan koneksi jaringan (jika tersedia)
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn) {
      if (conn.saveData || 
          conn.effectiveType === 'slow-2g' || 
          conn.effectiveType === '2g' || 
          conn.effectiveType === '3g') {
        return true;
      }
    }
  }
  
  // Cek apakah ua mengandung kata-kata yang umum pada perangkat low-end
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android 4.') || 
      ua.includes('android 5.') || 
      ua.includes('mobile') && ua.includes('windows phone')) {
    return true;
  }
  
  return false;
}

/**
 * Mengecek apakah perangkat mendukung WebP
 * 
 * @returns {Promise<boolean>} Promise yang resolve ke true jika WebP didukung
 */
export async function supportsWebP(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  if ('createImageBitmap' in window && 'avif' in document.createElement('picture')) {
    return true;
  }
  
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image.width > 0 && image.height > 0);
    image.onerror = () => resolve(false);
    image.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  });
}

/**
 * Menerapkan pengaturan performa untuk perangkat low-end
 * Ini akan menambahkan class khusus ke body dan mengubah pengaturan lainnya
 */
export function applyLowEndOptimizations(): void {
  if (typeof window === 'undefined') return;
  
  if (isLowEndDevice()) {
    // Tambahkan class khusus ke body untuk CSS targeting
    document.body.classList.add('low-end-device');
    
    // Nonaktifkan animasi
    document.body.classList.add('reduce-animations');
    
    // Kurangi ukuran GC dan muat gambar resolusi lebih rendah
    window.addEventListener('load', () => {
      // Hapus semua event listener yang tidak perlu
      const cleanupNodes = document.querySelectorAll('.cleanup-events');
      cleanupNodes.forEach(node => {
        const clone = node.cloneNode(true);
        node.parentNode?.replaceChild(clone, node);
      });
      
      // Jadwalkan garbage collection jika memungkinkan
      if ('gc' in window) {
        setTimeout(() => {
          (window as any).gc();
        }, 1000);
      }
    });
  }
}

/**
 * Mendeteksi jika pengguna menggunakan Data Saver
 * 
 * @returns {boolean} True jika Data Saver aktif
 */
export function isDataSaverEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn && conn.saveData) {
      return true;
    }
  }
  
  return false;
} 