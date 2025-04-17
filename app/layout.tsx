import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["Arial", "sans-serif"],
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
        <link
          rel="prefetch"
          href="/images/mobile/borobudur-mobile.jpg"
          as="image"
        />
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (navigator.connection && navigator.connection.saveData) {
                  document.documentElement.classList.add('save-data');
                }
                
                if (navigator.connection) {
                  if (navigator.connection.effectiveType === 'slow-2g' || 
                      navigator.connection.effectiveType === '2g') {
                    document.documentElement.classList.add('slow-network');
                  }
                }
                
                if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
                  document.documentElement.classList.add('low-memory');
                }
                
                // Improve touch response on mobile devices
                document.addEventListener('touchstart', function() {}, {passive: true});
                
                // Fix 300ms tap delay on mobile browsers
                document.documentElement.style.touchAction = 'manipulation';
              })();
            `,
          }}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, viewport-fit=cover, user-scalable=yes"
        />
        <meta name="theme-color" content="#FF5A5F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Script id="register-service-worker" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/service-worker.js')
                  .then(function(registration) {
                    console.log('Service Worker registered with scope:', registration.scope);
                  })
                  .catch(function(error) {
                    console.log('Service Worker registration failed:', error);
                  });
              });
            }
          `}
        </Script>
        <Script id="responsive-fixes" strategy="afterInteractive">
          {`
            // Fix iOS height issues with viewport
            function setVH() {
              let vh = window.innerHeight * 0.01;
              document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
            }
            
            // Set initial viewport height
            setVH();
            
            // Update on resize and orientation change
            window.addEventListener('resize', setVH);
            window.addEventListener('orientationchange', setVH);
            
            // Fix for better responsive handling on iOS devices
            document.documentElement.addEventListener('gesturestart', function(e) {
              e.preventDefault();
            });
          `}
        </Script>
      </body>
    </html>
  );
}
