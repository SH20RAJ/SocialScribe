const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create extension icons directory
const iconsDir = path.join(__dirname, '../extension/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG icon content
const svgIcon = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="64" cy="64" r="60" fill="url(#grad1)" />
  
  <!-- Main sparkle -->
  <path d="M64 20L68.5 44.5L93 49L68.5 53.5L64 78L59.5 53.5L35 49L59.5 44.5L64 20Z" fill="white" opacity="0.9"/>
  
  <!-- Small sparkle top right -->
  <path d="M88 35L90.5 42.5L98 45L90.5 47.5L88 55L85.5 47.5L78 45L85.5 42.5L88 35Z" fill="white" opacity="0.7"/>
  
  <!-- Small sparkle bottom left -->
  <path d="M40 73L42.5 80.5L50 83L42.5 85.5L40 93L37.5 85.5L30 83L37.5 80.5L40 73Z" fill="white" opacity="0.7"/>
  
  <!-- AI text -->
  <text x="64" y="105" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="white">AI</text>
</svg>
`;

// Generate icons in different sizes
const sizes = [16, 32, 48, 128];

async function generateIcons() {
  try {
    for (const size of sizes) {
      const buffer = Buffer.from(svgIcon);
      await sharp(buffer)
        .resize(size, size)
        .png()
        .toFile(path.join(iconsDir, `icon${size}.png`));
      
      console.log(`Generated icon${size}.png`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();