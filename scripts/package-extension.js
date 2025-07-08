const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create zip file
const output = fs.createWriteStream(path.join(publicDir, 'socialscribe-extension.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', function() {
  console.log(`Extension packaged successfully! (${archive.pointer()} total bytes)`);
  console.log('Extension zip file created at: public/socialscribe-extension.zip');
});

archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add extension files to the archive
const extensionDir = path.join(__dirname, '../extension');

// Add all files from extension directory
archive.directory(extensionDir, false);

// Finalize the archive
archive.finalize();

console.log('Packaging Chrome extension...');