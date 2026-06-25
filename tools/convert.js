const xlsx = require('xlsx');
const fs = require('fs-extra');
const path = require('path');

// Paths
const inputExcel = path.join(__dirname, 'input', 'products.xlsx');
const inputImages = path.join(__dirname, 'input', 'images');
const outputDir = path.join(__dirname, 'output');
const outputImages = path.join(outputDir, 'images');
const outputJson = path.join(outputDir, 'products.json');

// Clean output folder
fs.emptyDirSync(outputDir);
fs.ensureDirSync(outputImages);

// Read Excel
const workbook = xlsx.readFile(inputExcel);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

let data = xlsx.utils.sheet_to_json(sheet);

// Helper: slugify product name
function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces → -
    .replace(/[^\w\-]/g, ''); // remove special chars
}

// Supported extensions
const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

// Process products
data = data.map((item) => {
  const name = item.name || item.Name || '';
  const price = Number(item.price || item.Price) || 0;
  const description = item.description || item.Description || '';

  let finalImagePath = '';
  let foundImage = false;

  if (name) {
    const baseName = slugify(name);

    // Try all extensions
    for (const ext of extensions) {
      const fileName = baseName + ext;
      const srcImage = path.join(inputImages, fileName);
      const destImage = path.join(outputImages, fileName);

      if (fs.existsSync(srcImage)) {
        try {
          fs.copySync(srcImage, destImage);
          finalImagePath = `/images/${fileName}`;
          console.log(`✅ Copied: ${fileName}`);
          foundImage = true;
          break;
        } catch (err) {
          console.log(`❌ Error copying ${fileName}:`, err.message);
        }
      }
    }

    if (!foundImage) {
      console.log(`⚠️ No matching image found for: ${name}`);
    }
  }

  return {
    name,
    price,
    image: finalImagePath,
    description,
  };
});

// Remove invalid products (optional safety)
data = data.filter((p) => p.name);

// Decap CMS format
const finalOutput = {
  products: data,
};

// Save JSON
fs.writeFileSync(outputJson, JSON.stringify(finalOutput, null, 2));

console.log('✅ Import completed!');
console.log('📦 Output generated in /output folder');
