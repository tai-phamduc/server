const fs = require('fs');
const path = require('path');

// Files to process
const files = [
  './data/genreData.js',
  './data/tagData.js',
  './data/blogCategoryData.js',
  './data/directorData.js',
  './data/actorData.js',
  './data/formatData.js',
  './data/seatTypeData.js'
];

// Process each file
files.forEach(file => {
  try {
    // Read the file
    const filePath = path.resolve(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace all instances of "},\n  ," with "},"
    content = content.replace(/},\s*,/g, '},');

    // Write the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed commas in ${file}`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
});

console.log('Done fixing commas in data files');
