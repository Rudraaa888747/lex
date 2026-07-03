const fs = require('fs');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

async function extractImagesFromPdf(pdfBuffer) {
  const uint8Array = new Uint8Array(pdfBuffer);
  const loadingTask = pdfjs.getDocument(uint8Array);
  const doc = await loadingTask.promise;
  const numPages = doc.numPages;
  console.log(`Document has ${numPages} pages`);

  for (let pageNum = 1; pageNum <= Math.min(numPages, 3); pageNum++) {
    console.log(`Processing page ${pageNum}`);
    const page = await doc.getPage(pageNum);
    const ops = await page.getOperatorList();
    
    for (let i = 0; i < ops.fnArray.length; i++) {
      if (ops.fnArray[i] === pdfjs.OPS.paintImageXObject || ops.fnArray[i] === pdfjs.OPS.paintInlineImageXObject) {
        const objId = ops.argsArray[i][0];
        console.log(`Found image object: ${objId}`);
        try {
          const img = await page.objs.get(objId);
          console.log(`Image data length: ${img.data ? img.data.length : 'undefined'}, width: ${img.width}, height: ${img.height}`);
        } catch (e) {
          console.error(`Error getting image object ${objId}:`, e.message);
        }
      }
    }
  }
}

const testFile = process.argv[2];
if (testFile && fs.existsSync(testFile)) {
  const buffer = fs.readFileSync(testFile);
  extractImagesFromPdf(buffer).then(() => console.log('Done')).catch(console.error);
} else {
  console.log('Please provide a valid PDF file path');
}
