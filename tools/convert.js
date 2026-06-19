const xlsx = require('xlsx');
const fs = require('fs-extra');
const path = require('path');

// Paths
const inputExcel = path.join(__dirname, 'input', 'products.xlsx');
const inputImages = path.join(__dirname, 'input', 'images');
const outputDir = path.join(__dirname, 'output');
const outputImages = path.join(outputDir, 'images');
const outputJson = path.join(outputDir, 'products.json');

// Clean output folder first
fs.emptyDirSync(outputDir);
fs.ensureDirSync(outputImages);

// Read Excel
const workbook = xlsx.readFile(inputExcel);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

let data = xlsx.utils.sheet_to_json(sheet);

// Process products
data = data.map((item) => {
  const imageName = item.image || '';

  // Copy image from input → output
  const srcImage = path.join(inputImages, imageName);
  const destImage = path.join(outputImages, imageName);

  if (fs.existsSync(srcImage)) {
    fs.copySync(srcImage, destImage);
  } else {
    console.log(`⚠️ Image not found: ${imageName}`);
  }

  return {
    name: item.name || '',
    price: Number(item.price) || 0,
    image: '/images/' + imageName,
    description: item.description || '',
  };
});

// Save JSON
fs.writeFileSync(outputJson, JSON.stringify(data, null, 2));

console.log('✅ Import completed!');
console.log('📦 Output generated in /output folder');
