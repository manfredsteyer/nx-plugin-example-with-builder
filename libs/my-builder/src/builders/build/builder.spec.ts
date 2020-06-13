import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { schema } from '@angular-devkit/core';
import { join } from 'path';
import { of } from 'rxjs';

import * as buildAngular from '@angular-devkit/build-angular';
import * as updateBundles from './updateBundles';


describe('Command Runner Builder', () => {
  let architect: Architect;
  let architectHost: TestingArchitectHost;
  let updateSpy: jest.SpyInstance;

  beforeEach(async () => {
    const registry = new schema.CoreSchemaRegistry();
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);

    architectHost = new TestingArchitectHost('./', './');
    architect = new Architect(architectHost, registry);

    await architectHost.addBuilderFromPackage(join(__dirname, '../../..'));
  });

  beforeEach(() => {

    updateSpy = jest
      .spyOn(updateBundles, 'updateBundles')
      .mockReturnValue(null);

    jest
      .spyOn(buildAngular, 'executeBrowserBuilder')
      .mockImplementation(() => of({
        success: true,
        baseOutputPath: '',
        outputPath: 'path/to/dir',
        outputPaths: ['path/to/dir'],
      }));
  });

  afterEach(() => {
    updateSpy.mockRestore();
  })

  it('can run', async () => {
    const run = await architect.scheduleBuilder(
      '@my-org/my-builder:build', {});

    const output = await run.result;
    await run.stop();

    expect(output.success).toBe(true);
    expect(updateSpy).toBeCalledWith('path/to/dir');
  });
});
