const { exportImages } = require('pdf-export-images');
const fs = require('fs');

async function extractImages(pdfPath) {
  try {
    const data = fs.readFileSync(pdfPath);
    // exportImages takes a UInt8Array of the PDF
    const images = await exportImages(new Uint8Array(data), 'test_output');
    console.log(`Extracted ${images.length} images`);
    for (const img of images) {
      console.log(img.name, img.width, img.height);
    }
  } catch (error) {
    console.error('Extraction error:', error);
  }
}

const testFile = process.argv[2];
if (testFile && fs.existsSync(testFile)) {
  extractImages(testFile).then(() => console.log('Done')).catch(console.error);
} else {
  console.log('Please provide a valid PDF file path');
}
