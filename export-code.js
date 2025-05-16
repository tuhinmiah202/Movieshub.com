// This script bundles all source code files into a single file for easy download
const fs = require('fs');
const path = require('path');

const outputFilePath = 'all-code-files.txt';
let outputContent = '# MOVIE RECOMMENDATION WEBSITE - COMPLETE SOURCE CODE\n\n';

// Helper function to recursively get all files
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    // Skip node_modules, .git directories and the output file itself
    if (['node_modules', '.git', 'build', 'dist', outputFilePath].includes(file)) {
      return;
    }
    
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      // Only include source code files
      const ext = path.extname(file).toLowerCase();
      if (['.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.html'].includes(ext)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

// Get all files
const allFiles = getAllFiles('.');

// Sort files to group them by directory
allFiles.sort();

// Process each file
allFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Add file path as heading and content
    outputContent += `\n\n${'='.repeat(80)}\n`;
    outputContent += `FILE: ${filePath}\n`;
    outputContent += `${'='.repeat(80)}\n\n`;
    outputContent += content;
  } catch (error) {
    outputContent += `\n\nError reading file ${filePath}: ${error.message}\n`;
  }
});

// Write output file
fs.writeFileSync(outputFilePath, outputContent);

console.log(`All code files have been combined into ${outputFilePath}`);