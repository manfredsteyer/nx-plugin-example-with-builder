import {
  ensureNxProject,
  readFile,
  runNxCommandAsync,
  uniq,  
} from '@nrwl/nx-plugin/testing';
describe('my-builder e2e', () => {
  
  it('should create my-builder', async (done) => {

    const expected = '// (c) manfred.steyer@angulararchitects.io\n';

    const plugin = uniq('my-builder');

    ensureNxProject('@my-org/my-builder', 'dist/libs/my-builder');
    await runNxCommandAsync(`generate @nrwl/angular:app ${plugin}`);
    await runNxCommandAsync(`generate @my-org/my-builder:ng-add --project ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('ES5 bundle generation complete');
    console.debug('output', result.stdout);

    const mainJs = readFile(`dist/apps/${plugin}/main.js`);
    expect(mainJs.substr(0, expected.length)).toBe(expected);

    done();
  }, 360000);

  // describe('--directory', () => {
  //   it('should create src in the specified directory', async (done) => {
  //     const plugin = uniq('my-builder');
  //     ensureNxProject('@my-org/my-builder', 'dist/libs/my-builder');
  //     await runNxCommandAsync(
  //       `generate @my-org/my-builder:myBuilder ${plugin} --directory subdir`
  //     );
  //     expect(() =>
  //       checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
  //     ).not.toThrow();
  //     done();
  //   });
  // });

  // describe('--tags', () => {
  //   it('should add tags to nx.json', async (done) => {
  //     const plugin = uniq('my-builder');
  //     ensureNxProject('@my-org/my-builder', 'dist/libs/my-builder');
  //     await runNxCommandAsync(
  //       `generate @my-org/my-builder:myBuilder ${plugin} --tags e2etag,e2ePackage`
  //     );
  //     const nxJson = readJson('nx.json');
  //     expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
  //     done();
  //   });
  // });
});
