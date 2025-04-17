import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="notranslate" translate="no">
      <Head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Meta tags for better mobile experience */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#FF5A5F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Travel Places" />
        <meta name="apple-mobile-web-app-title" content="Travel Places" />
        
        {/* Performance optimization meta tags */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="google" content="notranslate" />

        {/* PWA related links */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/logo-192x192.png" />
        
        {/* Performance optimization: critical CSS inline */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical CSS for initial rendering */
          body {
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeSpeed;
            overflow-x: hidden;
          }
          
          /* Enhance tap targets on mobile */
          @media (max-width: 768px) {
            button, a[role="button"], input[type="button"], input[type="submit"] {
              min-height: 44px;
              min-width: 44px;
            }
          }
          
          /* Disable animations for users who prefer reduced motion */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
          
          /* Fix 100vh issues on mobile */
          .full-height {
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
          }
          
          /* Make text readable during page load */
          html {
            font-size: 16px;
            line-height: 1.5;
          }
          
          /* Hide skeleton placeholders for users with slow connections */
          .slow-network .skeleton {
            animation: none !important;
            background: #f0f0f0 !important;
          }
        `}} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 