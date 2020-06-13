import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { schema } from '@angular-devkit/core';
import { join } from 'path';
import { BuildBuilderSchema } from './schema';
import { BrowserBuilderOptions } from '@angular-devkit/build-angular';

const options: BuildBuilderSchema & BrowserBuilderOptions = {
  main: 'apps/demo/src/main.ts',
  outputPath: 'dist/apps/demo',
  index: 'apps/demo/src/index.html',
  tsConfig: 'apps/demo/tsconfig.json',
};

describe('Command Runner Builder', () => {
  let architect: Architect;
  let architectHost: TestingArchitectHost;

  beforeEach(async () => {
    const registry = new schema.CoreSchemaRegistry();
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);

    architectHost = new TestingArchitectHost('./', './');
    architect = new Architect(architectHost, registry);

    // This will either take a Node package name, or a path to the directory
    // for the package.json file.
    await architectHost.addBuilderFromPackage(join(__dirname, '../../..'));
  });

  it('can run', async () => {
    // A "run" can have multiple outputs, and contains progress information.
    
    const run = await architect.scheduleBuilder(
      '@my-org/my-builder:build',
      options
    );

    // The "result" member (of type BuilderOutput) is the next output.
    const output = await run.result;

    // Stop the builder from running. This stops Architect from keeping
    // the builder-associated states in memory, since builders keep waiting
    // to be scheduled.
    await run.stop();

    // Expect that it succeeded.
    expect(output.success).toBe(true);
  });
});
