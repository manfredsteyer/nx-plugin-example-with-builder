import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('my-builder e2e', () => {
  it('should create my-builder', async (done) => {
    const plugin = uniq('my-builder');
    ensureNxProject('@my-org/my-builder', 'dist/libs/my-builder');
    await runNxCommandAsync(`generate @my-org/my-builder:myBuilder ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Builder ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('my-builder');
      ensureNxProject('@my-org/my-builder', 'dist/libs/my-builder');
      await runNxCommandAsync(
        `generate @my-org/my-builder:myBuilder ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('my-builder');
      ensureNxProject('@my-org/my-builder', 'dist/libs/my-builder');
      await runNxCommandAsync(
        `generate @my-org/my-builder:myBuilder ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
