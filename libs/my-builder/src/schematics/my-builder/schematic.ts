import {
  chain,
  Rule,
} from '@angular-devkit/schematics';
import {
  updateWorkspace,
} from '@nrwl/workspace';
import { MyBuilderSchematicSchema } from './schema';

export default function (options: MyBuilderSchematicSchema): Rule {
  return chain([
    updateWorkspace((workspace) => {
      const project = workspace.projects.get(options.project);
      const build = project.targets.get('build');
      build.builder = '@my-org/my-builder:build';
    }),
  ]);
}
