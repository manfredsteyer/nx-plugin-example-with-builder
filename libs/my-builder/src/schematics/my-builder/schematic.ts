import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  url,
} from '@angular-devkit/schematics';
import {
  addProjectToNxJsonInTree,
  names,
  offsetFromRoot,
  projectRootDir,
  ProjectType,
  toFileName,
  updateWorkspace,
} from '@nrwl/workspace';
import { MyBuilderSchematicSchema } from './schema';

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = ProjectType.Library;

interface NormalizedSchema extends MyBuilderSchematicSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(options: MyBuilderSchematicSchema): NormalizedSchema {
  const name = toFileName(options.project);
  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir(projectType)}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url(`./files`), [
      applyTemplates({
        ...options,
        ...names(options.projectName),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
      }),
      move(options.projectRoot),
    ])
  );
}

export default function (options: MyBuilderSchematicSchema): Rule {
  const normalizedOptions = normalizeOptions(options);
  return chain([
    updateWorkspace((workspace) => {

      const build = workspace.projects.get(options.project)
      .targets.get('build');

      workspace.projects.get(options.project)
        .targets.delete('build');

      workspace.projects.get(options.project)
        // .add({
        //   name: normalizedOptions.projectName,
        //   root: normalizedOptions.projectRoot,
        //   sourceRoot: `${normalizedOptions.projectRoot}/src`,
        //   projectType,
        // })
        .targets
        .add({
          ...build,
          name: 'build',
          builder: '@my-org/my-builder:build',
        });
    }),
    // addProjectToNxJsonInTree(normalizedOptions.projectName, {
    //   tags: normalizedOptions.parsedTags,
    // }),
    // addFiles(normalizedOptions),
  ]);
}
