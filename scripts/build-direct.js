// Directly use Next.js internal API to build
const path = require('path');
const fs = require('fs');

// Force disable CSS optimization
process.env.NEXT_DISABLE_OPTIMIZED_CSS = 'true';

async function main() {
  console.log('Building Next.js app with custom approach...');
  
  const dir = process.cwd();
  
  try {
    // Programmatically import Next.js to avoid dependency on direct module structure
    const nextPath = path.dirname(require.resolve('next/package.json'));
    const buildFn = require(path.join(nextPath, 'dist/build')).default;
    
    // Call the build function
    await buildFn(dir, {
      experimental: {
        optimizeCss: false
      }
    });
    
    // Create .nojekyll file in the out directory
    const nojekyllPath = path.join(dir, 'out', '.nojekyll');
    fs.writeFileSync(nojekyllPath, '');
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

main(); 