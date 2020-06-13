import * as fs from 'fs';
import * as path from 'path';

export function updateBundles(outputPath: string) {

    const files = fs.readdirSync(outputPath);
    
    files
      .filter(file => file.endsWith('.js'))
      .forEach(file => {
  
        const filePath = path.join(outputPath, file);
        const content = fs.readFileSync(filePath,'utf-8');
        const updated = 
          `// (c) manfred.steyer@angulararchitects.io\n${content}`;
  
        fs.writeFileSync(filePath, updated, 'utf-8');
  
      });
  }