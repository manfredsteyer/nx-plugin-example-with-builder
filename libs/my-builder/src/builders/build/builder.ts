import {
  BuilderContext,
  createBuilder,
} from '@angular-devkit/architect';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BuildBuilderSchema } from './schema';
import { executeBrowserBuilder, BrowserBuilderOptions, BrowserBuilderOutput } from '@angular-devkit/build-angular';
import { updateBundles } from './updateBundles';

type Options = BuildBuilderSchema & BrowserBuilderOptions;

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
