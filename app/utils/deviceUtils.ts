/**
 * Utilitas untuk mendeteksi kemampuan perangkat dan mengoptimalkan performa
 */

/**
 * Simplified utilities for device detection
 */

/**
 * Basic check if device is low-end
 * 
 * @returns {boolean} True if device is likely low-end
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Simple memory check
  if ('deviceMemory' in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory && memory <= 2) {
      return true;
    }
  }
  
  // Simple CPU check
  if ('hardwareConcurrency' in navigator) {
    const cpuCores = navigator.hardwareConcurrency;
    if (cpuCores && cpuCores <= 2) {
      return true;
    }
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
 * Detect if user has data-saver enabled
 * 
 * @returns {boolean} True if data saver is enabled
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