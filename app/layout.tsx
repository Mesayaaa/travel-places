import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";

// Optimize font loading with display swap and optional subset
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
  weight: ["400", "500", "600", "700"], // Only load needed weights
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "Beautiful Places to Visit",
  description:
    "Discover amazing travel destinations and find their locations on Google Maps",
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Travel Places",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "Travel Places",
    "apple-mobile-web-app-title": "Travel Places",
    "msapplication-navbutton-color": "#0a0a0a",
    "msapplication-starturl": "/",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#ffffff",
    "msapplication-TileColor": "#ffffff",
    googlebot: "index,follow",
    google: "notranslate",
    "format-detection": "telephone=no",
    "x-dns-prefetch-control": "on",
    "Cache-Control": "public, max-age=31536000, immutable",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Resource hints for critical domains */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Preload critical images - only one most important image */}
        <link
          rel="preload"
          href="/images/mobile/borobudur-mobile.jpg"
          as="image"
          type="image/jpeg"
          media="(max-width: 768px)"
          fetchPriority="high"
        />

        {/* Critical inline script to detect slow devices */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check for save-data mode
                if (navigator.connection && navigator.connection.saveData) {
                  document.documentElement.classList.add('save-data');
                  localStorage.setItem('dataSaver', 'true');
                }
                
                // Check for slow network
                if (navigator.connection) {
                  const conn = navigator.connection;
                  const isSlow = conn.effectiveType === 'slow-2g' || 
                                 conn.effectiveType === '2g' ||
                                 conn.effectiveType === '3g' ||
                                 conn.downlink < 1.5;
                  
                  if (isSlow) {
                    document.documentElement.classList.add('slow-network');
                    localStorage.setItem('slowNetwork', 'true');
                    
                    // Inform service worker about connection
                    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                      navigator.serviceWorker.controller.postMessage({
                        type: 'CONNECTION_CHANGED',
                        effectiveType: conn.effectiveType
                      });
                    }
                  }
                }
                
                // Check for low memory devices
                if (navigator.deviceMemory && navigator.deviceMemory <= 4) {
                  document.documentElement.classList.add('low-memory');
                  
                  if (navigator.deviceMemory <= 2) {
                    document.documentElement.classList.add('very-low-memory');
                  }
                  
                  localStorage.setItem('lowMemoryDevice', 'true');
                }
                
                // Disable animations on low-end devices or when battery is low
                function disableNonEssentialAnimations() {
                  if ((navigator.deviceMemory && navigator.deviceMemory <= 2) || 
                      (navigator.connection && 
                      (navigator.connection.saveData || navigator.connection.effectiveType === '2g'))) {
                    document.documentElement.classList.add('reduce-motion');
                  }
                }
                
                disableNonEssentialAnimations();
                
                // Improve touch response on mobile devices
                document.addEventListener('touchstart', function() {}, {passive: true});
                document.addEventListener('touchmove', function() {}, {passive: true});
                
                // Fix 300ms tap delay on mobile browsers
                document.documentElement.style.touchAction = 'manipulation';
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className + " optimized-mobile"}>
        <Providers>{children}</Providers>

        {/* Load service worker conditionally with a strategy that doesn't block rendering */}
        <Script id="register-service-worker" strategy="lazyOnload">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                // Small delay to not compete with critical resources
                setTimeout(() => {
                  navigator.serviceWorker.register('/service-worker.js')
                    .then(function(registration) {
                      console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('Service Worker registration failed:', error);
                    });
                }, 2000);
              });
            }
          `}
        </Script>

        {/* Apply mobile optimizations */}
        <Script id="responsive-fixes" strategy="afterInteractive">
          {`
            // Fix iOS height issues with viewport
            function setVH() {
              let vh = window.innerHeight * 0.01;
              document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
            }
            
            // Set initial viewport height
            setVH();
            
            // Update on resize and orientation change but with debounce for better performance
            let resizeTimer;
            function handleResize() {
              clearTimeout(resizeTimer);
              resizeTimer = setTimeout(setVH, 100);
            }
            
            window.addEventListener('resize', handleResize);
            window.addEventListener('orientationchange', handleResize);
            
            // Lazy load non-critical resources
            if ('IntersectionObserver' in window) {
              const lazyImages = document.querySelectorAll('img[data-src]');
              const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    if (img.dataset.srcset) {
                      img.srcset = img.dataset.srcset;
                    }
                    imageObserver.unobserve(img);
                  }
                });
              });
              
              lazyImages.forEach(img => imageObserver.observe(img));
            }
          `}
        </Script>
      </body>
    </html>
  );
}
