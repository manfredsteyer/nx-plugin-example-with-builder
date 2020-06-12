import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { MyBuilderSchematicSchema } from './schema';

describe('my-builder schematic', () => {
  let appTree: Tree;
  const options: MyBuilderSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@my-org/my-builder',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('my-builder', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
