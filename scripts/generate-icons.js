const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create directories
const extensionIconsDir = path.join(__dirname, '../extension/icons');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(extensionIconsDir)) {
  fs.mkdirSync(extensionIconsDir, { recursive: true });
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SVG icon content - Brain icon like the website logo
const svgIcon = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#5854eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background rounded rectangle -->
  <rect x="8" y="8" width="112" height="112" rx="20" ry="20" fill="url(#grad1)" />
  
  <!-- Brain icon (scaled up from Lucide Brain) -->
  <g transform="translate(32, 32) scale(2.67)" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
    <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
    <path d="M6 18a4 4 0 0 1-1.967-.516"/>
    <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
  </g>
</svg>
`;

// Generate icons in different sizes
const extensionSizes = [16, 32, 48, 128];
const webSizes = [16, 32, 180, 192, 512]; // favicon and PWA sizes

async function generateIcons() {
  try {
    const buffer = Buffer.from(svgIcon);
    
    // Generate extension icons
    for (const size of extensionSizes) {
      await sharp(buffer)
        .resize(size, size)
        .png()
        .toFile(path.join(extensionIconsDir, `icon${size}.png`));
      
      console.log(`Generated extension icon${size}.png`);
    }
    
    // Generate web icons (favicon and PWA)
    for (const size of webSizes) {
      await sharp(buffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `icon-${size}x${size}.png`));
      
      console.log(`Generated web icon-${size}x${size}.png`);
    }
    
    // Generate favicon.ico (16x16 and 32x32 combined)
    await sharp(buffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    
    // Generate apple-touch-icon
    await sharp(buffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    
    console.log('Generated favicon.png and apple-touch-icon.png');
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();