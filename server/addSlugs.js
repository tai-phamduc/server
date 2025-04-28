const fs = require('fs');
const path = require('path');

// Function to convert a name to a slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

// Files to process
const files = [
  {
    path: './data/genreData.js',
    varName: 'genres'
  },
  {
    path: './data/tagData.js',
    varName: 'tagData'
  },
  {
    path: './data/blogCategoryData.js',
    varName: 'blogCategoryData'
  },
  {
    path: './data/directorData.js',
    varName: 'directorData'
  },
  {
    path: './data/actorData.js',
    varName: 'actorData'
  },
  {
    path: './data/formatData.js',
    varName: 'formatData'
  },
  {
    path: './data/seatTypeData.js',
    varName: 'seatTypeData'
  }
];

// Process each file
files.forEach(file => {
  try {
    // Read the file
    const filePath = path.resolve(__dirname, file.path);
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract the array
    const startMarker = `const ${file.varName} = [`;
    const endMarker = '];';

    const startIndex = content.indexOf(startMarker) + startMarker.length;
    const endIndex = content.lastIndexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
      console.error(`Could not find array in ${file.path}`);
      return;
    }

    const arrayContent = content.substring(startIndex, endIndex);

    // Split into individual objects
    const objects = [];
    let bracketCount = 0;
    let currentObject = '';

    for (let i = 0; i < arrayContent.length; i++) {
      const char = arrayContent[i];
      currentObject += char;

      if (char === '{') bracketCount++;
      if (char === '}') bracketCount--;

      if (bracketCount === 0 && char === '}') {
        objects.push(currentObject.trim());
        currentObject = '';
      }
    }

    // Add slug to each object
    const modifiedObjects = objects.map(obj => {
      // Extract name
      const nameMatch = obj.match(/name:\s*['"]([^'"]+)['"]/);
      if (!nameMatch) return obj;

      const name = nameMatch[1];
      const slug = slugify(name);

      // Check if object already has a slug
      if (obj.includes('slug:')) return obj;

      // Add slug after name
      return obj.replace(
        /name:\s*['"]([^'"]+)['"],/,
        `name: '${name}',\n    slug: '${slug}',`
      );
    });

    // Reconstruct the file
    const newContent =
      content.substring(0, startIndex) +
      modifiedObjects.join(',\n  ') +
      content.substring(endIndex);

    // Write the file
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Added slugs to ${file.path}`);
  } catch (error) {
    console.error(`Error processing ${file.path}:`, error);
  }
});

console.log('Done adding slugs to data files');
