const { build } = require('next/dist/build');
const { createWriteStream } = require('fs');
const { join } = require('path');
const fs = require('fs');

// Force disable CSS optimization
process.env.NEXT_DISABLE_OPTIMIZED_CSS = 'true';

async function main() {
  console.log('Building Next.js app with CSS optimization disabled...');
  
  const dir = process.cwd();
  const config = {
    experimental: {
      optimizeCss: false
    }
  };

  try {
    await build(dir, config);
    
    // Create .nojekyll file in the out directory
    const nojekyllPath = join(dir, 'out', '.nojekyll');
    fs.writeFileSync(nojekyllPath, '');
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

main(); 