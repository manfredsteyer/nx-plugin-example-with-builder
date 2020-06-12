import {
  BuilderContext,
  createBuilder,
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BuildBuilderSchema } from './schema';
import * as fs from 'fs';
import * as path from 'path';

import { executeBrowserBuilder, BrowserBuilderOptions, BrowserBuilderOutput } from '@angular-devkit/build-angular';


type Options = BuildBuilderSchema & BrowserBuilderOptions;

function updateBundles(outputPath: string) {

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

export function runBuilder(
  options: Options,
  context: BuilderContext
): Observable<BrowserBuilderOutput> {
  
  return executeBrowserBuilder(options, context).pipe(
    tap(output => {
      updateBundles(output.outputPaths[0]);
    })
  );

}

export default createBuilder<Options>(runBuilder);
