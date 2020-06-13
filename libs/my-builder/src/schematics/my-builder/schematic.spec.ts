import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';
import { MyBuilderSchematicSchema } from './schema';

const angularJson = `
{
  "version": 1,
  "projects": {
    "demo": {
      "projectType": "application",
      "schematics": {},
      "root": "apps/demo",
      "sourceRoot": "apps/demo/src",
      "prefix": "my-org",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/apps/demo",
            "index": "apps/demo/src/index.html",
            "main": "apps/demo/src/main.ts",
            "polyfills": "apps/demo/src/polyfills.ts",
            "tsConfig": "apps/demo/tsconfig.app.json",
            "aot": true,
            "assets": ["apps/demo/src/favicon.ico", "apps/demo/src/assets"],
            "styles": ["apps/demo/src/styles.css"],
            "scripts": []
          },
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "apps/demo/src/environments/environment.ts",
                  "with": "apps/demo/src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "6kb",
                  "maximumError": "10kb"
                }
              ]
            }
          }
        }
      }
    }
  }
}
`

describe('my-builder schematic', () => {
  let appTree: Tree;
  const options: MyBuilderSchematicSchema = { project: 'demo' };

  const testRunner = new SchematicTestRunner(
    '@my-org/my-builder',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
    appTree.create('angular.json', angularJson);
  });

  it('should run successfully', async () => {
    
    const tree = await testRunner.runSchematicAsync('ng-add', options, appTree).toPromise();
    const updatedAngularJson = JSON.parse(tree.readContent('angular.json'));

    const builder = updatedAngularJson?.projects?.demo?.architect?.build?.builder;

    expect(builder).not.toBeNull();
    expect(builder).toBe('@my-org/my-builder:build');
  });
});
