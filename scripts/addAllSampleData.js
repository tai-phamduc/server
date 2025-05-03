const { exec } = require('child_process');
const path = require('path');

console.log('Starting to add all sample data...');

const scripts = [
  'addSampleUsers.js',
  'addSampleGenres.js',
  'addSampleMovies.js',
  'addSampleEvents.js',
  'addSampleNews.js',
  'addSampleCinemas.js',
  'addSampleScreenings.js'
];

// Run scripts sequentially
const runScript = (index) => {
  if (index >= scripts.length) {
    console.log('All sample data added successfully!');
    return;
  }

  const script = scripts[index];
  console.log(`Running ${script}...`);

  const scriptPath = path.join(__dirname, script);
  const child = exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${script}: ${error}`);
      return;
    }
    
    console.log(stdout);
    
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    
    // Run the next script
    runScript(index + 1);
  });
};

// Start running scripts
runScript(0);
